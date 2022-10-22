import * as s from "./staticAnalysis";
import { getTable } from "./tables";
import { Operator } from "./types";
import { chooseRandomWithWeight } from "./utils";

function isNumber(n: any): n is number {
  return typeof n === "number";
}

/*
All supported operations
{%v1=%v2} : v1 = v2
{%v1=15} : v1 = 15
{%v1+%v2} : v1 = v1 + v2
{%v1+15} : v1 = v1 + 15
{%v1-%v2} : v1 = v1 - v2
{%v1-15} : v1 = v1 - 15
{%v1} : output v1
{$s1=$s2} : s1 = s2
{$s1=du text lala.} : s1 = txt
{$s1+$s2} : s1 = s1 + s2
{$s1+du text lala.} : s1 = s1 + txt
{$s1} : output s1
{\n} : output an endline
{table} : replace by table element
*/
export const operators: {
  regex: RegExp;
  makeOperator: (m: RegExpMatchArray) => Operator;
  analysis: (m: RegExpMatchArray) => s.StaticAnalysis;
}[] = [
  // {%v1=%v2}
  {
    regex: /^{%(.+)=%(.*)}/,
    makeOperator(m) {
      const v1 = m[1],
        v2 = m[2];
      return function operator(context) {
        context.vars[v1] = +context.vars[v2];
      };
    },
    analysis: (m) => ({
      def: [new s.NumberDef(m[1])],
      use: [new s.NumberUse(m[2])],
    }),
  },
  // {%v1=15}
  {
    regex: /^{%(.+)=(.*)}/,
    makeOperator(m) {
      const v1 = m[1],
        value = +m[2];
      return function operator(context) {
        context.vars[v1] = value;
      };
    },
    analysis: (m) => ({
      def: [new s.NumberDef(m[1])],
    }),
  },
  // {%v1+%v2}
  {
    regex: /^{%(.+)\+%(.*)}/,
    makeOperator(m) {
      const v1 = m[1],
        v2 = m[2];
      return function operator(context) {
        context.vars[v1] = +context.vars[v1] + +context.vars[v2];
      };
    },
    analysis: (m) => ({
      def: [new s.NumberDef(m[1])],
      use: [new s.NumberUse(m[1]), new s.NumberUse(m[2])],
    }),
  },
  // {%v1+15}
  {
    regex: /^{%(.+)\+(.*)}/,
    makeOperator(m) {
      const v1 = m[1],
        value = +m[2];
      return function operator(context) {
        context.vars[v1] = +context.vars[v1] + value;
      };
    },
    analysis: (m) => ({
      def: [new s.NumberDef(m[1])],
      use: [new s.NumberUse(m[1])],
    }),
  },
  // {%v1-%v2}
  {
    regex: /^{%(.+)-%(.*)}/,
    makeOperator(m) {
      const v1 = m[1],
        v2 = m[2];
      return function operator(context) {
        context.vars[v1] = +context.vars[v1] - +context.vars[v2];
      };
    },
    analysis: (m) => ({
      def: [new s.NumberDef(m[1])],
      use: [new s.NumberUse(m[1]), new s.NumberUse(m[2])],
    }),
  },
  // {%v1-15}
  {
    regex: /^{%(.+)-(.*)}/,
    makeOperator(m) {
      const v1 = m[1],
        value = +m[2];
      return function operator(context) {
        context.vars[v1] = +context.vars[v1] - value;
      };
    },
    analysis: (m) => ({
      def: [new s.NumberDef(m[1])],
      use: [new s.NumberUse(m[1])],
    }),
  },
  // {%v1}
  {
    regex: /^{%(.+)}/,
    makeOperator(m) {
      const v1 = m[1];
      return function operator(context) {
        return +context.vars[v1] | 0;
      };
    },
    analysis: (m) => ({
      use: [new s.NumberUse(m[1])],
    }),
  },
  // {$s1=$s2}
  {
    regex: /^{\$(.+)=\$(.*)}/,
    makeOperator(m) {
      const s1 = m[1],
        s2 = m[2];
      return function operator(context) {
        context.vars[s1] = String(context.vars[s2]);
      };
    },
    analysis: (m) => ({
      def: [new s.StringDef(m[1])],
      use: [new s.StringUse(m[2])],
    }),
  },
  // {$s1=du text lala.}
  {
    regex: /^{\$(.+)=(.*)}/,
    makeOperator(m) {
      const s1 = m[1],
        text = m[2];
      return function operator(context) {
        context.vars[s1] = text;
      };
    },
    analysis: (m) => ({
      def: [new s.StringDef(m[1])],
    }),
  },
  // {$s1+$s2}
  {
    regex: /^{\$(.+)\+\$(.*)}/,
    makeOperator(m) {
      const s1 = m[1],
        s2 = m[2];
      return function operator(context) {
        context.vars[s1] += String(context.vars[s2]);
      };
    },
    analysis: (m) => ({
      def: [new s.StringDef(m[1])],
      use: [new s.StringUse(m[1]), new s.StringUse(m[2])],
    }),
  },
  // {$s1+du text lala.}
  {
    regex: /^{\$(.+)\+(.*)}/,
    makeOperator(m) {
      const s1 = m[1],
        text = m[2];
      return function operator(context) {
        context.vars[s1] += text;
      };
    },
    analysis: (m) => ({
      def: [new s.StringDef(m[1])],
      use: [new s.StringUse(m[1])],
    }),
  },
  // {$s1}
  {
    regex: /^{\$(.+)}/,
    makeOperator(m) {
      const s1 = m[1];
      return function operator(context) {
        return context.vars[s1];
      };
    },
    analysis: (m) => ({
      use: [new s.StringUse(m[1])],
    }),
  },
  {
    regex: /^{\\n}$/,
    makeOperator() {
      return function operator() {
        return "\n";
      };
    },
    analysis: (m) => ({}),
  },
  // {table}
  {
    regex: /^{(.*)}/,
    makeOperator(m) {
      const tablename = m[1];
      return function operator(context, options) {
        const t = getTable(tablename);
        function chooseOption(index: number) {
          if (index >>> 0 >= t.options.length) {
            // @ts-expect-error
            const _console = console;
            if (typeof _console !== "undefined") {
              _console.warn?.("Index [%d] for table [%s]", index, tablename);
            }
            return chooseRandomWithWeight(t.options, t.w);
          }
          /*if(__DEV__) {
              console.log(
                "Table [%s] option forced to [%s]",
                tablename,
                t.options[index].original
              );
            }*/
          return t.options[index].v;
        }

        if (tablename === "race" && isNumber(options.race)) {
          return chooseOption(options.race);
        } else if (tablename === "forcealign" && isNumber(options.alignment)) {
          return chooseOption(options.alignment);
        } else if (tablename === "hooks" && isNumber(options.plothook)) {
          return chooseOption(options.plothook);
        } else if (tablename.match(/gender$/) && isNumber(options.gender)) {
          return chooseOption(options.gender);
        }
        if (
          isNumber(options.subrace) &&
          (tablename === "raceelf" || tablename === "racedwarf" || tablename === "racegnome" || tablename === "racehalfling" || tablename === "racegenasi")
        ) {
          return chooseOption(options.subrace);
        }

        if (isNumber(options.classorprof)) {
          if (tablename === "occupation") {
            return chooseOption(options.classorprof);
          } else if (isNumber(options.occupation1) && options.classorprof === 0 && tablename === "class") {
            return chooseOption(options.occupation1);
          } else if (isNumber(options.occupation1) && options.classorprof === 1 && tablename === "profession") {
            return chooseOption(options.occupation1);
          } else if (
            isNumber(options.occupation1) &&
            isNumber(options.occupation2) &&
            options.classorprof === 1 &&
            (tablename === "learned" ||
              tablename === "lesserNobility" ||
              tablename === "professional" ||
              tablename === "workClass" ||
              tablename === "martial" ||
              tablename === "underclass" ||
              tablename === "entertainer")
          ) {
            return chooseOption(options.occupation2);
          }
        }
        return chooseRandomWithWeight(t.options, t.w);
      };
    },
    analysis: (m) => ({
      table: m[1],
    }),
  },
];

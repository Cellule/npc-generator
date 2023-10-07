import type { DebugNode, GenerateOptionValueSimple, Npc, NpcGenerateOptions, NpcGenerateOptionsValues, NpcGenerateResult } from "../index.d";
import { getGroups } from "./groups";
import schema from "./schema.json";
import { getNamedTableOptions, getTableReferenceOptions } from "./tables";
import { Group, Primitives, SchemaDescriptor, SchemaElement, SchemaResult, WeightedValue } from "./types.js";
import { chooseRandomWithWeight } from "./utils";

function numberOrNull(v: any) {
  return typeof v === "number" ? v | 0 : null;
}

export function generate({ npcOptions }: { npcOptions?: NpcGenerateOptions } = {}): NpcGenerateResult {
  const options: Required<NpcGenerateOptions> = {
    race: numberOrNull(npcOptions?.race),
    subrace: numberOrNull(npcOptions?.subrace),
    classorprof: numberOrNull(npcOptions?.classorprof),
    occupation1: numberOrNull(npcOptions?.occupation1),
    occupation2: numberOrNull(npcOptions?.occupation2),
    alignment: numberOrNull(npcOptions?.alignment),
    plothook: numberOrNull(npcOptions?.plothook),
    gender: numberOrNull(npcOptions?.gender),
  };

  const context = { vars: {} };
  let debugNode: DebugNode = { o: "root", childs: [] };
  function processGroups(groups: Group[]) {
    let result: Primitives | undefined;
    const concatResult = (r: Primitives) => {
      if (typeof result === "undefined") {
        result = r;
      } else {
        result = String(result) + r;
      }
    };

    for (const instruction of groups) {
      if (typeof instruction === "string") {
        debugNode.childs.push(instruction);
        concatResult(instruction);
      } else {
        const oldNode = debugNode;
        const node = { o: instruction.original, childs: [] };
        debugNode.childs.push(node);
        debugNode = node;
        if (typeof instruction === "function") {
          const insRes = instruction(context, options);
          if (insRes !== undefined) {
            if (Array.isArray(insRes)) {
              concatResult(processGroups(insRes));
            } else {
              concatResult(insRes);
            }
          }
        } else if (Array.isArray(instruction)) {
          concatResult(processGroups(instruction));
        }
        debugNode = oldNode;
      }
    }
    return result ?? "";
  }

  function chooseFromArray(arr: WeightedValue[]): string {
    const totalWeight = arr.reduce(function (w, e) {
      return w + (e.w | 0);
    }, 0);
    return chooseRandomWithWeight(arr, totalWeight);
  }

  function processSchema(schemaElement: SchemaDescriptor): SchemaResult;
  function processSchema(schemaElement: any): string;
  function processSchema(schemaElement: SchemaElement | SchemaDescriptor): SchemaResult | Primitives {
    if (typeof schemaElement === "string") {
      return processGroups(getGroups(schemaElement));
    } else if (Array.isArray(schemaElement)) {
      return processSchema(chooseFromArray(schemaElement));
    }
    const result: SchemaResult = {};
    for (const name of Object.keys(schemaElement)) {
      const element = schemaElement[name];
      // need to make a choice based on weight
      result[name] = processSchema(element);
    }
    return result;
  }

  // process inititalisation first, most of the selection is done here
  processGroups(getGroups(schema.options.initialisation));

  // Force to Npc type because we know schema.output matches the Npc type
  const npc: Npc = processSchema(schema.output) as any;
  return { npc, debugNode };
}

export function getNpcOptionsValues(): NpcGenerateOptionsValues {
  const subraces: Record<string, GenerateOptionValueSimple | undefined> = {
    elf: getNamedTableOptions("raceelf"),
    dwarf: getNamedTableOptions("racedwarf"),
    gnome: getNamedTableOptions("racegnome"),
    halfling: getNamedTableOptions("racehalfling"),
  };
  const races = getTableReferenceOptions("race").map(({ name, table, value }) => ({
    name,
    value,
    subraces: subraces[table],
  }));

  const genders = getNamedTableOptions("gender");
  const alignments = getNamedTableOptions("forcealign");
  const plothooks = getNamedTableOptions("hooks");
  const classes = getNamedTableOptions("class");

  const professionCategories: Record<string, GenerateOptionValueSimple | undefined> = {
    learned: getNamedTableOptions("learned"),
    lesserNobility: getNamedTableOptions("lesserNobility"),
    professional: getNamedTableOptions("professional"),
    workClass: getNamedTableOptions("workClass"),
    martial: getNamedTableOptions("martial"),
    underclass: getNamedTableOptions("underclass"),
    entertainer: getNamedTableOptions("entertainer"),
  };
  const professions = getTableReferenceOptions("profession").map(({ name, table, value }) => ({
    name,
    value,
    professionCategories: professionCategories[table]!,
  }));
  const occupations = getTableReferenceOptions("occupation").map(({ name, table, value }) => ({
    name,
    value,
    classes: table === "class" ? classes : undefined,
    professions: table === "profession" ? professions : undefined,
  }));

  return {
    races,
    genders,
    alignments,
    plothooks,
    occupations,
    classes,
    professions,
  };
}

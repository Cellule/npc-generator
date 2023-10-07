import { operators } from "./operators";
import { Group } from "./types";

function mapGroup(g: string): Group {
  //todo: replace escaped \{ and \}
  if (g[0] === "{") {
    for (const op of operators) {
      const m = g.match(op.regex);
      if (m) {
        return op.makeOperator(m);
      }
    }
    return () => {};
  }
  return g;
}

export const reGroup = /{((\\{|\\}|[^{}])*)}|((\\{|\\}|[^{}])+)/g;
export function getGroups(val: string): Group[] {
  if (typeof val !== "string" || val.length === 0) {
    throw new Error("Empty value to get group");
  }
  val = val.replace("{\\n}", "\n");
  const r = (val.match(reGroup) || []).map((g) => {
    const r = mapGroup(g);
    if (typeof r !== "string") {
      r.original = g;
    }
    return r;
  });
  return r;
}

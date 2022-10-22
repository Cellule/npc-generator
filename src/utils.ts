import type { DebugNode } from "../index.d";

export function chooseRandomWithWeight<T>(
  arr: {
    w: number;
    v: T;
  }[],
  totalWeight: number,
): T {
  let rnum = (Math.random() * totalWeight + 1) | 0;
  let i = 0;
  while (rnum > 0) {
    rnum -= arr[i++].w;
  }
  return arr[i - 1].v;
}

export function debugNodeToString(debugNode: DebugNode | undefined): string | undefined {
  if (!debugNode) {
    return undefined;
  }
  let depth = 0;
  const lines: string[] = [];
  const indent = () => " ".repeat(depth);
  const processNode = (node: DebugNode | string) => {
    if (typeof node === "string") {
      lines.push(indent() + `-> ${node}`);
    } else {
      lines.push(indent() + `-> ${node.o}`);
      depth++;
      for (const child of node.childs) {
        processNode(child);
      }
      depth--;
    }
  };
  processNode(debugNode);
  return lines.join("\n");
}

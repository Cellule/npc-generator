import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dirname = path.dirname(fileURLToPath(import.meta.url));

const tables = fs
  .readdirSync(path.join(dirname, "../src/tables"))
  .filter((file) => file.endsWith(".json"))
  .map((table) => {
    const name = table.replace(".json", "");
    // Alias reserved javascript keywords
    const alias = name === "class" ? "class_" : name;
    return {
      alias,
      file: table,
      exported: name,
    };
  })
  .sort((a, b) => a.exported.localeCompare(b.exported, undefined, { sensitivity: "base" }));

const tableImports = tables.map(({ alias, file }) => `import ${alias} from "./tables/${file}" with { type: "json" }`).join("\n");
const tableExports = tables.map(({ alias, exported }) => (alias === exported ? exported : `${exported}: ${alias}`)).join(",\n  ");

const content = `// This file is generated automatically. Do not edit it manually.
${tableImports}

export default {
  ${tableExports}
};
`;

fs.writeFileSync(path.join(dirname, "../src/tables.data.gen.ts"), content);

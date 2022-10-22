const fs = require("fs");
const path = require("path");

const tables = fs
  .readdirSync(path.join(__dirname, "../src/tables"))
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
  });

const tableImports = tables.map(({ alias, file }) => `import ${alias} from "./tables/${file}"`).join("\n");
const tableExports = tables.map(({ alias, exported }) => (alias === exported ? exported : `${exported}: ${alias}`)).join(",\n  ");

const content = `// This file is generated automatically. Do not edit it manually.
${tableImports}

export default {
  ${tableExports}
};
`;

fs.writeFileSync(path.join(__dirname, "../src/tables.data.gen.ts"), content);

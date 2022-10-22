import { GenerateOptionValueSimple } from "../index.d";
import { getGroups } from "./groups";
import data from "./tables.data.gen";
import { Option } from "./types";

interface TableEntry {
  w: number;
  options: Option[];
}

interface Tables {
  [name: string]: TableEntry;
}
const tables = {} as Tables;

// We can't initialize synchronously because of cyclic imports between tables and utils
let lazyInitializeTables: (() => void) | undefined = () => {
  lazyInitializeTables = undefined;
  for (const [name, table] of Object.entries(data)) {
    let totalWeight = 0;
    const options = table.map((row) => {
      const w = row.w > 0 ? row.w : 0;
      totalWeight += w;
      return {
        ...row,
        w,
        v: getGroups(row.v) || [],
        original: row.v,
      };
    });
    setTable(name, { w: totalWeight, options });
  }
};

export function getTableNames() {
  lazyInitializeTables?.();
  return Object.keys(tables);
}

export function setTable(name: string, table: TableEntry) {
  tables[name] = table;
}

export function getTable(tableName: string) {
  lazyInitializeTables?.();
  if (!(tableName in tables)) {
    throw new Error(`Unable to find table [${tableName}]`);
  }
  return tables[tableName];
}

interface NamedOption extends Option {
  name?: string;
}
interface TableReferenceOption extends NamedOption {
  table?: string;
}

export function getNamedTableOptions(tableName: string): GenerateOptionValueSimple {
  const options = getTable(tableName).options as NamedOption[];
  return options.map((o, i) => ({ name: o.name!, value: i })).filter((o) => !!o.name);
}

export function getTableReferenceOptions(tableName: string): { name: string; table: string; value: number }[] {
  const options = getTable(tableName).options as TableReferenceOption[];
  for (const opt of options) {
    if (!("table" in opt)) {
      throw new Error(`Missing "table" property in table ${tableName} option ${opt.original}`);
    }
  }
  return options
    .map((o, i) => ({
      name: o.name!,
      value: i,
      table: o.table!,
    }))
    .filter((o) => !!o.name);
}

export function getTableWeight(tableName: string) {
  return getTable(tableName).w;
}

export function getTableOptions(tableName: string) {
  return getTable(tableName).options;
}

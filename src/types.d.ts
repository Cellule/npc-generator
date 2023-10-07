import type { NpcGenerateOptions } from "../index.d";

export type Primitives = string | number;
export interface WeightedValue {
  w: number;
  v: string;
}

export interface Option {
  w: number;
  v: Group[];
  original: string;
}

export type Operator = ((context: { vars: { [key: string]: Primitives } }, options: NpcGenerateOptions) => Primitives | Group[] | void) & {
  original?: string;
};
export type Group = Operator | string;

export type SchemaElement = string | WeightedValue[];
export type SchemaDescriptor = { [name: string]: SchemaElement | SchemaDescriptor };
export type SchemaResult = {
  [element: string]: SchemaResult | string;
};

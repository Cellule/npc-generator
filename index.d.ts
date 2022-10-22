export type DebugNode = { o?: string; childs: (DebugNode | string)[] };
export interface NpcGenerateOptions {
  race?: number | null;
  subrace?: number | null;
  classorprof?: number | null;
  occupation1?: number | null;
  occupation2?: number | null;
  alignment?: number | null;
  plothook?: number | null;
  gender?: number | null;
}

type GenerateOptionValueSimple = Array<{ name: string; value: number }>;
type ProfessionOptionValues = Array<{
  name: string;
  value: number;
  professionCategories: GenerateOptionValueSimple;
}>;

export interface NpcGenerateOptionsValues {
  alignments: GenerateOptionValueSimple;
  classes: GenerateOptionValueSimple;
  genders: GenerateOptionValueSimple;
  plothooks: GenerateOptionValueSimple;
  occupations: Array<{
    name: string;
    value: number;
    classes?: GenerateOptionValueSimple;
    professions?: ProfessionOptionValues;
  }>;
  professions: ProfessionOptionValues;
  races: Array<{
    name: string;
    value: number;
    subraces: GenerateOptionValueSimple | undefined;
  }>;
}

export interface NpcGenerateResult {
  npc: Npc;
  debugNode: DebugNode;
}

export interface Npc {
  description: {
    name: string;
    kenkuname: string;
    age: number;
    gender: string;
    race: string;
    occupation: string;
    pronounMinus: string;
    pronounCapit: string;
  };
  physical: {
    hair: string;
    eyes: string;
    skin: string;
    height: number;
    build: string;
    face: string;
    special1: string;
    special2: string;
  };
  alignment: {
    good: number;
    moralneutral: number;
    evil: number;
    lawful: number;
    ethicalneutral: number;
    chaotic: number;
  };
  relationship: {
    orientation: string;
    status: string;
  };
  religion: {
    description: string;
  };
  ptraits: {
    traitslizards: string;
    traitsgoliaths: string;
    traits1: string;
    traits2: string;
  };
  pquirks: {
    description: string;
  };
  hook: {
    description: string;
  };
  abilities: NpcAbilities;
}

export interface NpcAbilities {
  charisma: number;
  constitution: number;
  dexterity: number;
  intelligence: number;
  strength: number;
  wisdom: number;
}

export function generate(options?: { npcOptions?: NpcGenerateOptions }): NpcGenerateResult;
export function getNpcOptionsValues(): NpcGenerateOptionsValues;
export function debugNodeToString(debugNode: DebugNode): string;
export function debugNodeToString(debugNode: DebugNode | undefined): string | undefined;

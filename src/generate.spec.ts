import chai, { assert, expect } from "chai";
import deepEqualInAnyOrder from "deep-equal-in-any-order";
import "mocha";
import { generate, getNpcOptionsValues } from "..";

chai.use(deepEqualInAnyOrder);

it("generates a random npm", () => {
  const { npc } = generate();
  const { abilities, alignment, description, hook, physical, pquirks, ptraits, relationship, religion } = npc;
  // check abilities are positive numbers
  expect(abilities).to.be.an("object");
  expect(abilities).to.have.all.keys("str", "dex", "con", "int", "wis", "cha");
  assert.typeOf(abilities.cha, "number");
  assert.isAtLeast(abilities.cha, 0);
  assert.typeOf(abilities.con, "number");
  assert.isAtLeast(abilities.con, 0);
  assert.typeOf(abilities.dex, "number");
  assert.isAtLeast(abilities.dex, 0);
  assert.typeOf(abilities.int, "number");
  assert.isAtLeast(abilities.int, 0);
  assert.typeOf(abilities.str, "number");
  assert.isAtLeast(abilities.str, 0);
  assert.typeOf(abilities.wis, "number");
  assert.isAtLeast(abilities.wis, 0);
});

it("returns expected npc options", () => {
  // Snapshow testing
  const options = getNpcOptionsValues();
  const { alignments, classes, genders, plothooks, professions, races, ...rest } = options;
  expect(rest).to.be.empty;
  expect(options).to.deep.equalInAnyOrder({
    alignments: [{ name: "Good" }, { name: "Evil" }],
    classes: [
      { name: "Artificier" },
      { name: "Barbarian" },
      { name: "Bard" },
      { name: "Cleric" },
      { name: "Druid" },
      { name: "Fighter" },
      { name: "Monk" },
      { name: "Mystic" },
      { name: "Paladin" },
      { name: "Ranger" },
      { name: "Rogue" },
      { name: "Sorcerer" },
      { name: "Warlock" },
      { name: "Wizard" },
    ],
    genders: [{ name: "Male" }, { name: "Female" }],
    plothooks: [{ name: "Classic" }, { name: "Funky" }],
    professions: [
      {
        name: "Learned",
        professionCategories: [
          { name: "Astrologer" },
          { name: "Cartographer" },
          { name: "Historian" },
          { name: "Poet" },
          { name: "Philosopher" },
          { name: "Hermit" },
          { name: "Wandering Pilgrim" },
          { name: "Barber" },
          { name: "Doctor" },
          { name: "Medic" },
          { name: "Barrister" },
          { name: "Herald" },
          { name: "Scribe" },
          { name: "Acolyte" },
          { name: "Neophyte" },
        ],
      },
      {
        name: "Lesser Nobility",
        professionCategories: [{ name: "Explorer" }, { name: "Diplomat" }, { name: "Knight" }, { name: "Minister" }, { name: "Page" }, { name: "Squire" }],
      },
      {
        name: "Professional",
        professionCategories: [
          { name: "Armorer" },
          { name: "Painter" },
          { name: "Baker" },
          { name: "Banker" },
          { name: "Blacksmith" },
          { name: "Bowyer" },
          { name: "Brewer" },
          { name: "Butcher" },
          { name: "Carpenter" },
          { name: "Clothier" },
          { name: "Cook" },
          { name: "Furrier" },
          { name: "Goldsmith" },
          { name: "Innkeeper" },
          { name: "Jeweler" },
          { name: "Leatherworker" },
          { name: "Locksmith" },
          { name: "Mason" },
          { name: "Merchant" },
          { name: "Musician" },
          { name: "Tinker" },
          { name: "Torturer" },
          { name: "Trader" },
          { name: "Weaver" },
        ],
      },
      {
        name: "Working Class",
        professionCategories: [
          { name: "Boat" },
          { name: "Coach" },
          { name: "Farmer" },
          { name: "Fisher" },
          { name: "Gravedigger" },
          { name: "Sheppard" },
          { name: "Trapper" },
          { name: "Messenger" },
          { name: "Miller" },
          { name: "Miner" },
          { name: "Peddler" },
          { name: "Ratcatcher" },
          { name: "Sailor" },
        ],
      },
      {
        name: "Martial",
        professionCategories: [
          { name: "Bodyguard" },
          { name: "Bounty Hunter" },
          { name: "Forester" },
          { name: "Gladiator" },
          { name: "Jailer" },
          { name: "Soldier" },
        ],
      },
      {
        name: "Underclass",
        professionCategories: [
          { name: "Bandit" },
          { name: "Beggar" },
          { name: "Fence" },
          { name: "Pickpocket" },
          { name: "Procurer" },
          { name: "Prostitute" },
          { name: "Slaver" },
          { name: "Smuggler" },
        ],
      },
      {
        name: "Entertainer",
        professionCategories: [
          { name: "Acrobat" },
          { name: "Actor" },
          { name: "Clown" },
          { name: "Dancer" },
          { name: "Fortune-Teller" },
          { name: "Juggler" },
          { name: "Prestidigitator" },
          { name: "Funambulist" },
          { name: "Storyteller" },
        ],
      },
    ],
    races: [
      { name: "Aasimar", subraces: undefined },
      { name: "Dragonborn", subraces: undefined },
      {
        name: "Dwarf",
        subraces: [{ name: "Mountain Dwarf" }, { name: "Hill Dwarf" }],
      },
      {
        name: "Elf",
        subraces: [{ name: "Drow" }, { name: "High Elf" }, { name: "Wood Elf" }],
      },
      { name: "Firbolg", subraces: undefined },
      {
        name: "Gnome",
        subraces: [{ name: "Forest Gnome" }, { name: "Rock Gnome" }],
      },
      { name: "Goblin", subraces: undefined },
      { name: "Goliath", subraces: undefined },
      {
        name: "Halfling",
        subraces: [{ name: "Lightfoot Halfling" }, { name: "Stout Halfling" }],
      },
      { name: "Half-Elf", subraces: undefined },
      { name: "Half-Orc", subraces: undefined },
      ,
      { name: "Human", subraces: undefined },
      { name: "Kenku", subraces: undefined },
      { name: "Lizardfolk", subraces: undefined },
      { name: "Medusa", subraces: undefined },
      { name: "Orc", subraces: undefined },
      { name: "Tabaxi", subraces: undefined },
      { name: "Tiefling", subraces: undefined },
      { name: "Triton", subraces: undefined },
      { name: "Troglodyte", subraces: undefined },
    ],
  });
});

import { describe, expect, it } from "vitest";
import { generate, getNpcOptionsValues } from "../generate";
import { debugNodeToString } from "../utils";

describe("generate", () => {
  it("generates a random npc that respects the schema/type", () => {
    const { npc } = generate();

    const { abilities, alignment, description, hook, physical, pquirks, ptraits, relationship, religion } = npc;
    // check abilities are positive numbers
    expect(abilities).toEqual(
      expect.objectContaining({
        charisma: expect.any(Number),
        constitution: expect.any(Number),
        dexterity: expect.any(Number),
        intelligence: expect.any(Number),
        strength: expect.any(Number),
        wisdom: expect.any(Number),
      }),
    );
    // check alignment are positive numbers
    expect(alignment).toEqual(
      expect.objectContaining({
        good: expect.any(Number),
        moralneutral: expect.any(Number),
        evil: expect.any(Number),
        lawful: expect.any(Number),
        ethicalneutral: expect.any(Number),
        chaotic: expect.any(Number),
      }),
    );

    // check descriptions
    expect(description).toEqual(
      expect.objectContaining({
        name: expect.any(String),
        age: expect.any(Number),
        kenkuname: expect.any(String),
        gender: expect.any(String),
        race: expect.any(String),
        occupation: expect.any(String),
        pronounMinus: expect.any(String),
        pronounCapit: expect.any(String),
      }),
    );

    // check physical
    expect(physical).toEqual(
      expect.objectContaining({
        hair: expect.any(String),
        eyes: expect.any(String),
        skin: expect.any(String),
        height: expect.any(Number),
        build: expect.any(String),
        face: expect.any(String),
        special1: expect.any(String),
        special2: expect.any(String),
      }),
    );

    // check relationship
    expect(relationship).toEqual(
      expect.objectContaining({
        orientation: expect.any(String),
        status: expect.any(String),
      }),
    );

    // check religion
    expect(religion).toEqual(
      expect.objectContaining({
        description: expect.any(String),
      }),
    );

    // check ptraits
    expect(ptraits).toEqual(
      expect.objectContaining({
        traitslizards: expect.any(String),
        traitsgoliaths: expect.any(String),
        traits1: expect.any(String),
        traits2: expect.any(String),
      }),
    );

    // check pquirks
    expect(pquirks).toEqual(
      expect.objectContaining({
        description: expect.any(String),
      }),
    );

    // check hook
    expect(hook).toEqual(
      expect.objectContaining({
        description: expect.any(String),
      }),
    );
  });

  const options = getNpcOptionsValues();
  it("returns expected npc options", () => {
    expect(options).toMatchSnapshot("npc-options");
  });

  it.each(options.races)("always generates expected race $name", (race) => {
    const { npc } = generate({
      npcOptions: { race: race.value },
    });
    const raceLc = race.name.toLowerCase();
    const generatedRaceLc = npc.description.race.toLowerCase();
    if (raceLc === "lizardfolk") {
      expect(generatedRaceLc).toContain("lizard");
    } else {
      if (race.subraces?.length) {
        expect(generatedRaceLc).toMatch(new RegExp(race.subraces.map((subrace) => subrace.name.toLowerCase()).join("|")));
      } else {
        expect(generatedRaceLc).toContain(raceLc);
      }
    }
  });

  const subRacesCases = options.races.flatMap((race) => race.subraces?.map((subrace) => ({ race, subrace })));
  it.each(subRacesCases.filter((o): o is Exclude<typeof o, undefined> => !!o))(
    "always generates expected subrace $race.name:$subrace.name",
    ({ race, subrace }) => {
      const { npc } = generate({
        npcOptions: { race: race.value, subrace: subrace.value },
      });
      const subraceLc = subrace.name.toLowerCase();
      const generatedRaceLc = npc.description.race.toLowerCase();
      expect(generatedRaceLc).toContain(subraceLc);
    },
  );

  it.each(options.genders)("always generates expected gender $name", (gender) => {
    const { npc } = generate({
      npcOptions: {
        gender: gender.value,
      },
    });

    const genderLc = gender.name.toLowerCase();
    const generatedGenderLc = npc.description.gender.toLowerCase();
    expect(generatedGenderLc).toContain(genderLc);
  });

  it.each(options.alignments)("generates expected alignment $name most of the time", (alignment) => {
    let error;
    // Try 3 times to get a good result
    for (let i = 0; i < 3; i++) {
      const { npc } = generate({
        npcOptions: {
          alignment: alignment.value,
        },
      });
      try {
        if (alignment.name === "Good") {
          expect(npc.alignment.good).toBeGreaterThan(npc.alignment.evil);
          return;
        } else {
          expect(npc.alignment.evil).toBeGreaterThan(npc.alignment.good);
          return;
        }
      } catch (e) {
        error = e;
      }
    }
    throw error;
  });

  it.each(options.classes)("always generates expected class $name", (class_) => {
    const { npc } = generate({
      npcOptions: {
        classorprof: 0,
        occupation1: class_.value,
      },
    });

    const classLc = class_.name.toLowerCase();
    const generatedClassLc = npc.description.occupation.toLowerCase();
    expect(generatedClassLc).toContain(classLc);
  });

  it.each(options.plothooks)("always generates expected plothook $name", (plothook) => {
    const { npc, debugNode } = generate({
      npcOptions: {
        plothook: plothook.value,
      },
    });
    const path = debugNodeToString(debugNode);
    expect(path).toContain(plothook.name === "Classic" ? `-> {hooks1}` : `-> {hooks2}`);
  });

  // TODO:: test Professions options

  it.each(options.professions)("profession $name should have subcategories", (profession) => {
    expect(profession.professionCategories?.length).toBeGreaterThan(1);
  });
});

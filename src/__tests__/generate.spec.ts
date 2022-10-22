import { generate, getNpcOptionsValues } from "../generate";

describe("generate", () => {
  it("generates a random npm", () => {
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
  });

  it("returns expected npc options", () => {
    const options = getNpcOptionsValues();
    expect(options).toMatchSnapshot("npc-options");
  });
});

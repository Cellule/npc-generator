import { generate, getNpcOptionsValues } from "../..";

describe("generate", () => {
  it("generates a random npm", () => {
    const { npc } = generate();

    const { abilities, alignment, description, hook, physical, pquirks, ptraits, relationship, religion } = npc;
    // check abilities are positive numbers
    // expect(abilities).toBe.an("object");
    // expect(abilities).to.have.all.keys("str", "dex", "con", "int", "wis", "cha");
  });

  it("returns expected npc options", () => {
    const options = getNpcOptionsValues();
    expect(options).toMatchSnapshot("npc-options");
  });
});

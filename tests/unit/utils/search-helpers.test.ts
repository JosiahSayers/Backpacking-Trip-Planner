import { db } from "$/utils/db";
import { searchCategories } from "$/utils/search-helpers";
import { describe, expect, it } from "bun:test";

describe("searchCategories", () => {
  it("returns a row for a full match", async () => {
    const expectedMatch = await db.gearCategory.findFirst({
      where: { name: "Bidets" },
    });
    const results = await searchCategories("bidets");
    expect(results).toContainEqual(expectedMatch!);
  });

  it("returns a row for a partial match", async () => {
    const expectedMatch = await db.gearCategory.findFirst({
      where: { name: "Bidets" },
    });
    const results = await searchCategories("biD");
    expect(results).toContainEqual(expectedMatch!);
  });

  it("returns a row for multiple word full matches", async () => {
    const expectedMatch = await db.gearCategory.findFirst({
      where: { name: "Pack Organization" },
    });
    const results = await searchCategories("Pack organization");
    expect(results).toContainEqual(expectedMatch!);
  });

  it("returns a row for multiple word partial matches", async () => {
    const expectedMatch = await db.gearCategory.findFirst({
      where: { name: "Pack Organization" },
    });
    const results = await searchCategories("p org");
    expect(results).toContainEqual(expectedMatch!);
  });
});

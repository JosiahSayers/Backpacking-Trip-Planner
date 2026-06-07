import { describe, expect, it } from "bun:test";
import { make } from "../../helpers/test-data/make";
import { transformers } from "$/transformers";

describe("transform", () => {
  it("returns the expected shape", () => {
    const section = make("PackingListSection");
    expect(transformers.packingListSection(section)).toEqual({
      id: section.id,
      name: section.name,
      sortPosition: section.sortPosition,
    });
  });
});

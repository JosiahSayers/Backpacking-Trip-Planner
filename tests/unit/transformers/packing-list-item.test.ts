import { describe, expect, it } from "bun:test";
import { make } from "../../helpers/test-data/make";
import { transformers } from "$/transformers";

describe("transform", () => {
  it("returns the expected shape", () => {
    const item = make("PackingListItem");
    expect(transformers.packingListItem(item)).toEqual({
      id: item.id,
      name: item.name,
      optional: item.optional,
      quantity: item.quantity,
      sortPosition: item.sortPosition,
    });
  });
});

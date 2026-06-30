import { describe, expect, it, mock } from "bun:test";
import {
  getHighestSort,
  newPositionIsNotLastPosition,
  sendOutOfOrderResponse,
} from "$/utils/sorting";

describe("getHighestSort", () => {
  it("returns 0 when sortObjects is empty", () => {
    expect(getHighestSort([])).toBe(0);
  });

  it("returns the sortPosition when sortObjects has a single item", () => {
    expect(getHighestSort([{ sortPosition: 5 }])).toBe(5);
  });

  it("returns the max sortPosition from the passed in sortObjects", () => {
    expect(
      getHighestSort([
        { sortPosition: 3 },
        { sortPosition: 7 },
        { sortPosition: 1 },
      ]),
    ).toBe(7);
  });
});

describe("newPositionIsNotLastPosition", () => {
  it("returns false if newSortPosition is undefined", () => {
    expect(newPositionIsNotLastPosition(5, undefined)).toBe(false);
  });

  it("returns false if newSortPosition is null", () => {
    expect(newPositionIsNotLastPosition(5, null as never)).toBe(false);
  });

  it("returns false if newSortPosition is greater than currentHighestSort", () => {
    expect(newPositionIsNotLastPosition(5, 6)).toBe(false);
  });

  it("returns true if newSortPosition is equal to currentHighestSort", () => {
    expect(newPositionIsNotLastPosition(5, 5)).toBe(true);
  });

  it("returns true if newSortPosition is less than currentHighestSort", () => {
    expect(newPositionIsNotLastPosition(5, 3)).toBe(true);
  });
});

describe("sendOutOfOrderResponse", () => {
  const mockJson = mock(() => {});
  const mockStatus = mock(() => ({ json: mockJson }));
  const mockRes = { status: mockStatus } as never;

  it("sends a response with a 400 status code", () => {
    sendOutOfOrderResponse(mockRes, 5, 3);
    expect(mockStatus).toHaveBeenCalledWith(400);
  });

  it("sends a response with the expected JSON", () => {
    sendOutOfOrderResponse(mockRes, 5, 3);
    expect(mockJson).toHaveBeenCalledWith({
      error:
        '"sortPosition" should be higher than the current highest sort position. You provided: 3, currentHighest: 5',
    });
  });
});

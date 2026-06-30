/**
 * Returns a new array sorted by `sortPosition` ascending.
 *
 * The backend does not guarantee any ordering in its responses — `sortPosition`
 * is the source of truth — so every render path that displays ordered data
 * (packing list sections, items, etc.) must sort with this before rendering.
 */
export function sortByPosition<T extends { sortPosition: number }>(
  items: T[],
): T[] {
  return [...items].sort((a, b) => a.sortPosition - b.sortPosition);
}

import type {
  GearCategory,
  GearInventoryItem,
} from "../../generated/prisma/client";
import {
  transform as transformCategory,
  type ClientGeatCategory,
} from "$/transformers/gear-category";

export type ClientGearInventoryItem = Pick<
  GearInventoryItem,
  "id" | "name" | "quantity"
> & { category: ClientGeatCategory };

export function transform(
  item: GearInventoryItem & { category: GearCategory },
): ClientGearInventoryItem {
  return {
    id: item.id,
    name: item.name,
    quantity: item.quantity,
    category: transformCategory(item.category),
  };
}

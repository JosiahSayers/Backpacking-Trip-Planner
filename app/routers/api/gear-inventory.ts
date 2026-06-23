import { userCanAccessGearInventoryItem } from "$/middleware/authorization/gear-inventory-item";
import { requireValidSession } from "$/middleware/require-valid-session";
import { transformers } from "$/transformers";
import { db } from "$/utils/db";
import { createGearInventoryItemValidator } from "$/validation/gear-inventory";
import { Router } from "express";
import validate from "express-zod-safe";
import type { GearCategory } from "../../../generated/prisma/client";

export const gearInventoryRouter = Router();
gearInventoryRouter.use(requireValidSession);

gearInventoryRouter.post(
  "/",
  validate({ body: createGearInventoryItemValidator }),
  async (req, res) => {
    let category: GearCategory;

    if (req.body.newCategoryName) {
      category = await db.gearCategory.create({
        data: {
          name: req.body.newCategoryName,
          userId: req.session!.user.id,
        },
      });
    } else {
      const existing = await db.gearCategory.findUnique({
        where: {
          id: req.body.existingCategoryId,
          OR: [{ userId: req.session!.user.id }, { public: true }],
        },
      });

      if (!existing) {
        return res.status(404).json({ error: "Unable to find category" });
      }

      category = existing;
    }

    const newItem = await db.gearInventoryItem.create({
      data: {
        name: req.body.name,
        quantity: req.body.quantity,
        userId: req.session!.user.id,
        gearCategoryId: category.id,
        grams: req.body.grams,
      },
      include: {
        category: true,
      },
    });

    return res
      .status(201)
      .json({ item: transformers.gearInventoryItem(newItem) });
  },
);

gearInventoryRouter.put(
  "/:id",
  validate({ body: createGearInventoryItemValidator }),
  userCanAccessGearInventoryItem,
  async (req, res) => {
    const existingItem = await db.gearInventoryItem.findUnique({
      where: { id: Number(req.params.id) },
      include: { category: true },
    });

    // if category is changing
    //   if new category, create new category
    //   if existing category, find it and make sure the user can access it
    //   delete old category if no other items are associated with it

    // update other fields when passed.
  },
);

gearInventoryRouter.get("/", async (req, res) => {
  const items = await db.gearInventoryItem.findMany({
    where: {
      userId: req.session!.user.id,
    },
    include: {
      category: true,
    },
  });
  return res.json({ items: items.map(transformers.gearInventoryItem) });
});

gearInventoryRouter.delete(
  "/:id",
  userCanAccessGearInventoryItem,
  async (req, res) => {
    await db.gearInventoryItem.delete({
      where: { id: Number(req.params.id), userId: req.session!.user.id },
    });
    return res.sendStatus(200);
  },
);

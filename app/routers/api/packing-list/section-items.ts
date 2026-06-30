import { transformers } from "$/transformers";
import { db } from "$/utils/db";
import {
  getHighestSort,
  newPositionIsNotLastPosition,
  sendOutOfOrderResponse,
} from "$/utils/sorting";
import { createItem } from "$/validation/packing-list/item";
import { sectionParams } from "$/validation/packing-list/section";
import { Router } from "express";
import validate from "express-zod-safe";

export const itemsRouter = Router({ mergeParams: true });

itemsRouter.post(
  "/",
  validate({ body: createItem, params: sectionParams }),
  async (req, res) => {
    const existingItems = await db.packingListItem.findMany({
      where: {
        packingListSectionId: Number(req.params.sectionId),
      },
    });

    const currentHighestSort = getHighestSort(existingItems);

    if (
      newPositionIsNotLastPosition(currentHighestSort, req.body.sortPosition)
    ) {
      return sendOutOfOrderResponse(
        res,
        currentHighestSort,
        req.body.sortPosition,
      );
    }

    if (existingItems.find((item) => item.name === req.body.name)) {
      return res.status(400).json({
        error: `"${req.body.name}" is already an item in this section`,
      });
    }

    const newItem = await db.packingListItem.create({
      data: {
        name: req.body.name,
        quantity: req.body.quantity,
        sortPosition: req.body.sortPosition ?? currentHighestSort + 1,
        packingListSectionId: Number(req.params.sectionId),
        gearInventoryItemId: req.body.assignedGearId,
        gearCategoryId: req.body.gearCategoryId,
      },
    });

    return res
      .status(201)
      .json({ item: transformers.packingListItem(newItem) });
  },
);

itemsRouter.delete("/:itemId", validate({}), async (req, res) => {});

itemsRouter.patch("/:itemId", validate({}), async (req, res) => {});

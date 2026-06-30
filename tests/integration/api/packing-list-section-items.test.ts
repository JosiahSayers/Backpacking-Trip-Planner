import { afterEach, beforeAll, describe, expect, it } from "bun:test";
import { getAuthCookies } from "../../helpers/auth";
import supertest from "supertest";
import { app } from "$/server";
import { db } from "$/utils/db";

let authCookies: string[];
let packingListId: number;
let sectionId: number;

beforeAll(async () => {
  authCookies = await getAuthCookies();

  const listRes = await supertest(app)
    .post("/api/packing-lists")
    .set("Cookie", authCookies)
    .send({ name: "Section Items Test List" })
    .expect(201);
  packingListId = listRes.body.packingList.id;

  const sectionRes = await supertest(app)
    .post(`/api/packing-lists/${packingListId}/sections`)
    .set("Cookie", authCookies)
    .send({ name: "Test Section" })
    .expect(201);
  sectionId = sectionRes.body.section.id;
});

afterEach(async () => {
  await db.packingListItem.deleteMany({
    where: {
      packingListSectionId: sectionId,
    },
  });
});

describe("POST /", () => {
  it("requires a valid session", async () => {
    await supertest(app)
      .post(`/api/packing-lists/${packingListId}/sections/${sectionId}/items`)
      .send({ name: "My Item", quantity: 1 })
      .expect(401);
  });

  it("returns 404 when the packing list does not exist", async () => {
    await supertest(app)
      .post(`/api/packing-lists/-1/sections/${sectionId}/items`)
      .set("Cookie", authCookies)
      .send({ name: "My Item", quantity: 1 })
      .expect(404);
  });

  it("returns 403 when the user does not own the packing list", async () => {
    const user2Cookies = await getAuthCookies("user2@test.com");
    await supertest(app)
      .post(`/api/packing-lists/${packingListId}/sections/${sectionId}/items`)
      .set("Cookie", user2Cookies)
      .send({ name: "My Item", quantity: 1 })
      .expect(403);
  });

  it("returns 400 when name is not provided", async () => {
    const { body } = await supertest(app)
      .post(`/api/packing-lists/${packingListId}/sections/${sectionId}/items`)
      .set("Cookie", authCookies)
      .send({ quantity: 1 })
      .expect(400);
    expect(body).toMatchInlineSnapshot(`
      [
        {
          "errors": [
            {
              "code": "invalid_type",
              "expected": "string",
              "message": "Invalid input: expected string, received undefined",
              "path": [
                "name",
              ],
            },
          ],
          "type": "body",
        },
      ]
    `);
  });

  it("returns 400 when name is shorter than 3 characters", async () => {
    const { body } = await supertest(app)
      .post(`/api/packing-lists/${packingListId}/sections/${sectionId}/items`)
      .set("Cookie", authCookies)
      .send({ name: "ab", quantity: 1 })
      .expect(400);
    expect(body).toMatchInlineSnapshot(`
      [
        {
          "errors": [
            {
              "code": "too_small",
              "inclusive": true,
              "message": "Too small: expected string to have >=3 characters",
              "minimum": 3,
              "origin": "string",
              "path": [
                "name",
              ],
            },
          ],
          "type": "body",
        },
      ]
    `);
  });

  it("returns 400 when quantity is not provided", async () => {
    const { body } = await supertest(app)
      .post(`/api/packing-lists/${packingListId}/sections/${sectionId}/items`)
      .set("Cookie", authCookies)
      .send({ name: "My Item" })
      .expect(400);
    expect(body).toMatchInlineSnapshot(`
      [
        {
          "errors": [
            {
              "code": "invalid_type",
              "expected": "number",
              "message": "Invalid input: expected number, received undefined",
              "path": [
                "quantity",
              ],
            },
          ],
          "type": "body",
        },
      ]
    `);
  });

  it("creates a new item and returns 201", async () => {
    const { body } = await supertest(app)
      .post(`/api/packing-lists/${packingListId}/sections/${sectionId}/items`)
      .set("Cookie", authCookies)
      .send({ name: "My Item", quantity: 2, sortPosition: 1 })
      .expect(201);
    expect(body).toEqual({
      item: {
        id: expect.any(Number),
        name: "My Item",
        quantity: 2,
        optional: false,
        sortPosition: 1,
      },
    });
  });

  it("returns 400 when an item with the same name already exists in the section", async () => {
    await db.packingListItem.create({
      data: {
        name: "My Item",
        packingListSectionId: sectionId,
        sortPosition: 1,
      },
    });
    const { body } = await supertest(app)
      .post(`/api/packing-lists/${packingListId}/sections/${sectionId}/items`)
      .set("Cookie", authCookies)
      .send({ name: "My Item", quantity: 1 })
      .expect(400);
    expect(body).toMatchInlineSnapshot(`
      {
        "error": ""My Item" is already an item in this section",
      }
    `);
  });

  it("returns 400 when sortPosition is not higher than the current highest", async () => {
    await db.packingListItem.create({
      data: {
        name: "My Item",
        packingListSectionId: sectionId,
        sortPosition: 1,
      },
    });
    const { body } = await supertest(app)
      .post(`/api/packing-lists/${packingListId}/sections/${sectionId}/items`)
      .set("Cookie", authCookies)
      .send({ name: "Another Item", quantity: 1, sortPosition: 1 })
      .expect(400);
    expect(body).toMatchInlineSnapshot(`
      {
        "error": ""sortPosition" should be higher than the current highest sort position. You provided: 1, currentHighest: 1",
      }
    `);
  });
});

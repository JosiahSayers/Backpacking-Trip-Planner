import { app } from "$/server";
import { describe, it, expect } from "bun:test";
import request from "supertest";

describe("POST /", () => {
  it("returns the message sent in the body", (done) => {
    request(app)
      .post("/api/example")
      .send({ message: "Test Message" })
      .expect("Content-Type", /json/)
      .expect({ message: "Test Message" })
      .expect(200, done);
  });

  it("returns a validation error when message is empty", async () => {
    const response = await request(app)
      .post("/api/example")
      .send({ message: "" })
      .expect("Content-Type", /json/)
      .expect(400);
    expect(response.body).toMatchInlineSnapshot(`
      [
        {
          "errors": [
            {
              "code": "too_small",
              "inclusive": true,
              "message": "Too small: expected string to have >=1 characters",
              "minimum": 1,
              "origin": "string",
              "path": [
                "message",
              ],
            },
          ],
          "type": "body",
        },
      ]
    `);
  });

  it("returns a validation error when message is not sent", async () => {
    const response = await request(app)
      .post("/api/example")
      .send({})
      .expect("Content-Type", /json/)
      .expect(400);
    expect(response.body).toMatchInlineSnapshot(`
      [
        {
          "errors": [
            {
              "code": "invalid_type",
              "expected": "string",
              "message": "Invalid input: expected string, received undefined",
              "path": [
                "message",
              ],
            },
          ],
          "type": "body",
        },
      ]
    `);
  });
});

describe("GET /", () => {
  it("returns the message sent in the body", (done) => {
    request(app)
      .get("/api/example")
      .query({ message: "Test Message" })
      .expect("Content-Type", /json/)
      .expect({ message: "Test Message" })
      .expect(200, done);
  });

  it("returns a validation error when message is empty", async () => {
    const response = await request(app)
      .get("/api/example")
      .query({ message: "" })
      .expect("Content-Type", /json/)
      .expect(400);
    expect(response.body).toMatchInlineSnapshot(`
      [
        {
          "errors": [
            {
              "code": "too_small",
              "inclusive": true,
              "message": "Too small: expected string to have >=1 characters",
              "minimum": 1,
              "origin": "string",
              "path": [
                "message",
              ],
            },
          ],
          "type": "query",
        },
      ]
    `);
  });

  it("returns a validation error when message is not sent", async () => {
    const response = await request(app)
      .get("/api/example")
      .query({})
      .expect("Content-Type", /json/)
      .expect(400);
    expect(response.body).toMatchInlineSnapshot(`
      [
        {
          "errors": [
            {
              "code": "invalid_type",
              "expected": "string",
              "message": "Invalid input: expected string, received undefined",
              "path": [
                "message",
              ],
            },
          ],
          "type": "query",
        },
      ]
    `);
  });
});

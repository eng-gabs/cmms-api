// import { app } from "../..";
// import request from "supertest";
// import { connectDB } from "../../db/connection";

// beforeAll(async () => {
//   await connectDB();
// });

// function sum(a: number, b: number) {
//   return a + b;
// }
// test("adds 1 + 2 to equal 3", () => {
//   expect(sum(1, 2)).toBe(3);
// });

// describe("User", () => {
//   it("basic", async () => {
//     const r = await request(app).get("/");
//     expect(r.body).toMatchObject({
//       message: "Express + TypeScript Server",
//     });
//   });
//   it("getAll", async () => {
//     const r = await request(app).get("/api/user/all");
//     expect(r).toMatchObject({
//       id: "",
//     });
//   });
// });

import { assert } from "chai";

export function addition(a: number, b: number): number {
  return a + b;
}

describe("Calculator Tests 2", () => {
  it("should return 5 when 2 is added to 3", () => {
    const result = addition(2, 3);
    assert.equal(result, 5);
  });
});

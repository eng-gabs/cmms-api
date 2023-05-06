import chai from "chai";
import chaiHttp from "chai-http";
import { app } from "../..";
import { connectDB } from "../../db/connection";
import { UserModel } from "../../models/user";
import { connection } from "mongoose";
chai.use(chaiHttp);

describe("User Test Suite", () => {
  before(async () => {
    await connectDB();
    await UserModel.deleteMany();
  });
  after(async () => {
    await UserModel.deleteMany();
    await connection.close();
  });
  it("first", async () => {
    const result = await chai.request(app).get("/");
    chai.assert.equal(result.text, "Express + TypeScript Server");
  });
  it("second", async () => {
    const result = await chai.request(app).get("/api/user/create");
    return chai
      .expect(result.body.data)
      .to.equal({ email: "teste@teste.com", name: "Gabs" });
  });
});

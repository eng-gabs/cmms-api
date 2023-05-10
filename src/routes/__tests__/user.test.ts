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
  it("Hello World", async () => {
    const result = await chai.request(app).get("/");
    chai.assert.equal(result.text, "Express + TypeScript Server");
  });
  it("Create User: POST /api/user", async () => {
    const result = await chai
      .request(app)
      .post("/api/user")
      .send({ email: "teste@teste.com", name: "Gabs" });
    return chai
      .expect(result.body.data)
      .to.contain({ email: "teste@teste.com", name: "Gabs" });
  });
  it("Fetch User: GET /api/user/:id", async () => {
    const user = await UserModel.create({
      name: "UserToFetch",
      email: "userToFetch@test.com",
    });
    const result = await chai.request(app).get(`/api/user/${user.id}`);
    return chai.expect(result.body.data).to.contain({
      name: "UserToFetch",
      email: "userToFetch@test.com",
    });
  });
  it("Update User: PUT /api/user/:id", async () => {
    const user = await UserModel.create({
      name: "UserToUpdate",
      email: "userToUpdate@test.com",
    });
    const result = await chai
      .request(app)
      .put(`/api/user/${user.id}`)
      .send({ name: "UserUpdated" });
    return chai.expect(result.body.data).to.contain({
      name: "UserUpdated",
      email: "userToUpdate@test.com",
    });
  });
  // TODO: update user with company
  it("Delete User: DELETE /api/user/:id", async () => {
    const user = await UserModel.create({
      name: "UserToDelete",
      email: "userToDelete@test.com",
    });
    const result = await chai.request(app).delete(`/api/user/${user.id}`);
    return chai.expect(result.body.data).to.contain({
      name: "UserToDelete",
      email: "userToDelete@test.com",
    });
  });
});

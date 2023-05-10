import chai from "chai";
import chaiHttp from "chai-http";
import { app } from "../..";
import { connectDB } from "../../db/connection";
import { connection } from "mongoose";
import { CompanyModel } from "../../models/company";
chai.use(chaiHttp);

describe("Company Test Suite", () => {
  before(async () => {
    await connectDB();
    await CompanyModel.deleteMany();
  });
  after(async () => {
    await CompanyModel.deleteMany();
    await connection.close();
  });
  it("Create Company: POST /api/company", async () => {
    const result = await chai
      .request(app)
      .post("/api/company")
      .send({ name: "Test Company" });
    return chai.expect(result.body.data).to.contain({ name: "Test Company" });
  });
  it("Fetch Company: GET /api/company/:id", async () => {
    const company = await CompanyModel.create({
      name: "CompanyToFetch",
    });
    const result = await chai.request(app).get(`/api/company/${company.id}`);
    return chai.expect(result.body.data).to.contain({
      name: "CompanyToFetch",
    });
  });
  it("Update Company: PUT /api/company/:id", async () => {
    const company = await CompanyModel.create({
      name: "CompanyToUpdate",
    });
    const result = await chai
      .request(app)
      .put(`/api/company/${company.id}`)
      .send({ name: "CompanyUpdated" });
    return chai.expect(result.body.data).to.contain({
      name: "CompanyUpdated",
    });
  });
  // TODO: update company with company
  it("Delete Company: DELETE /api/company/:id", async () => {
    const company = await CompanyModel.create({
      name: "CompanyToDelete",
    });
    const result = await chai.request(app).delete(`/api/company/${company.id}`);
    return chai.expect(result.body.data).to.contain({
      name: "CompanyToDelete",
    });
  });
});

import chai from "chai";
import chaiHttp from "chai-http";
import { app } from "../..";
import { connectDB, disconnectDB } from "../../db/connection";
import { connection, Document } from "mongoose";
import { UnitModel } from "../../models/unit";
import { UserModel } from "../../models/user";
import { Company, CompanyModel } from "../../models/company";
import { clearDatabase } from "./utils";
chai.use(chaiHttp);

class CompanyForTesting {
  private companyDoc: Company | null = null;
  constructor() {}
  async create() {
    this.companyDoc = await CompanyModel.create({
      name: "Empresa teste Units",
      units: [],
      users: [],
    });
    return this.companyDoc;
  }
  async get() {
    return this.companyDoc ?? (await this.create());
  }
}

async function createCompanyForTesting() {
  return await CompanyModel.create({
    name: "Empresa teste Units",
    units: [],
    users: [],
  });
}

describe("Unit Test Suite", () => {
  before(async () => {
    await connectDB();
    await clearDatabase();
    new CompanyForTesting().create();
  });
  after(async () => {
    await clearDatabase();
    await disconnectDB();
  });
  it("Create Unit: POST /api/unit", async () => {
    const company = await createCompanyForTesting();
    const result = await chai
      .request(app)
      .post("/api/unit")
      .send({ name: "Test Unit", companyId: company._id });
    return chai
      .expect(result.body.data)
      .to.contain({ name: "Test Unit", company: company._id.toString() });

    // chai.expect(result.body.data.company).to.contain({ _id: company._id });
  });
  it("Fetch Unit: GET /api/unit/:id", async () => {
    const company = await createCompanyForTesting();
    const unit = await UnitModel.create({
      name: "UnitToFetch",
      company: company._id,
    });
    const result = await chai.request(app).get(`/api/unit/${unit.id}`);
    chai.expect(result.body.data).to.contain({
      name: "UnitToFetch",
    });
    return chai
      .expect(result.body.data.company)
      .to.contain({ _id: company._id.toString() });
  });
  it("Update Unit: PATCH /api/unit/:id", async () => {
    const company = await createCompanyForTesting();
    const unit = await UnitModel.create({
      name: "UnitToUpdate",
      company: company._id,
    });
    const result = await chai
      .request(app)
      .patch(`/api/unit/${unit.id}`)
      .send({ name: "UnitUpdated" });
    return chai.expect(result.body.data).to.contain({
      name: "UnitUpdated", // TODO: change company
      company: company._id.toString(),
    });
  });

  it("Delete Unit: DELETE /api/unit/:id", async () => {
    const company = await createCompanyForTesting();
    const unit = await UnitModel.create({
      name: "UnitToDelete",
      company: company._id,
    });
    const result = await chai.request(app).delete(`/api/unit/${unit.id}`);
    return chai.expect(result.body.data).to.contain({
      name: "UnitToDelete",
      company: company._id.toString(),
    });
  });
});

import chai from "chai";
import chaiHttp from "chai-http";
import { app } from "../..";
import { connectDB, disconnectDB } from "../../db/connection";
import { connection, Document } from "mongoose";
import { AssetModel } from "../../models/asset";
import { UserModel } from "../../models/user";
import { Company, CompanyModel } from "../../models/company";
import { clearDatabase } from "./utils";
import { UnitModel } from "../../models/unit";
chai.use(chaiHttp);

async function createUnitForTesting() {
  const company = await CompanyModel.create({
    name: "Empresa teste Assets",
  });
  return await UnitModel.create({
    name: "Unit teste Assets",
    company: company.id,
    assets: [],
  });
}

describe("Asset Test Suite", () => {
  before(async () => {
    await connectDB();
    await clearDatabase();
  });
  after(async () => {
    await clearDatabase();
    await disconnectDB();
  });
  it("Create Asset: POST /api/unit/:id/asset", async () => {
    const unit = await createUnitForTesting();
    const result = await chai
      .request(app)
      .post(`/api/unit/${unit._id}/asset`)
      .send({
        name: "Test Asset",
        unitId: unit._id,
        description: "descricao",
        image: "urlDaImagem",
        model: "modelo",
        owner: "dono",
        status: "Running",
        healthLevel: 1,
      });
    return chai
      .expect(result.body.data)
      .to.contain({ name: "Test Asset", unit: unit._id.toString() });
  });
  it("Fetch Asset: GET /api/asset/:id", async () => {
    const unit = await createUnitForTesting();
    const asset = await AssetModel.create({
      name: "AssetToFetch",
      unit: unit._id,
      description: "descricao",
      image: "urlDaImagem",
      model: "modelo",
      owner: "dono",
      status: "Running",
      healthLevel: 1,
    });
    const result = await chai.request(app).get(`/api/asset/${asset.id}`);
    chai.expect(result.body.data).to.contain({
      name: "AssetToFetch",
    });
    return chai
      .expect(result.body.data.unit)
      .to.contain({ _id: unit._id.toString() });
  });
  it("Update Asset: PATCH /api/asset/:id", async () => {
    const unit = await createUnitForTesting();
    const asset = await AssetModel.create({
      name: "AssetToUpdate",
      unit: unit._id,
      description: "descricao",
      image: "urlDaImagem",
      model: "modelo",
      owner: "dono",
      status: "Running",
      healthLevel: 1,
    });
    const result = await chai
      .request(app)
      .patch(`/api/asset/${asset.id}`)
      .send({ name: "AssetUpdated" });
    return chai.expect(result.body.data).to.contain({
      name: "AssetUpdated", // TODO: change unit
      unit: unit._id.toString(),
    });
  });

  it("Delete Asset: DELETE /api/asset/:id", async () => {
    const unit = await createUnitForTesting();
    const asset = await AssetModel.create({
      name: "AssetToDelete",
      unit: unit._id,
      description: "descricao",
      image: "urlDaImagem",
      model: "modelo",
      owner: "dono",
      status: "Running",
      healthLevel: 1,
    });
    const result = await chai.request(app).delete(`/api/asset/${asset.id}`);
    return chai.expect(result.body.data).to.contain({
      name: "AssetToDelete",
      unit: unit._id.toString(),
    });
  });
});

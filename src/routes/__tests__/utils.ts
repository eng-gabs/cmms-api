import { AssetModel } from "../../models/asset";
import { CompanyModel } from "../../models/company";
import { UnitModel } from "../../models/unit";
import { UserModel } from "../../models/user";

export async function clearDatabase() {
  await UnitModel.deleteMany();
  await CompanyModel.deleteMany();
  await UserModel.deleteMany();
  await AssetModel.deleteMany();
}

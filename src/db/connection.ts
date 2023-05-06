import mongoose, { connect, set } from "mongoose";

async function main() {
  try {
    set("strictQuery", true);
    // await mongoose.connect(
    //   "mongodb+srv://gmduarte96:SdCMvjNnQPl8jBfy@cluster0.rejc6oo.mongodb.net/?retryWrites=true&w=majority"
    // );
    await connect(process.env.DBHOST!, {
      dbName: process.env.DBNAME!,
    });
    console.log("MongoDB Conected", process.env.DBNAME!);
  } catch (error) {
    console.error("Error connecting DB");
  }
}

export const connectDB = main;

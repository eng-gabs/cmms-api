import mongoose from "mongoose";

async function main() {
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(
      "mongodb+srv://gmduarte96:SdCMvjNnQPl8jBfy@cluster0.rejc6oo.mongodb.net/?retryWrites=true&w=majority"
    );
    console.log("MongoDB Conected");
  } catch (error) {}
}

export const connectDB = main;

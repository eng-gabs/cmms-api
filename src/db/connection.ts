import mongoose, { connect, connection, set } from "mongoose";

async function main() {
  try {
    set("strictQuery", true);
    await connect(process.env.DBHOST!, {
      dbName: process.env.DBNAME!,
    });
    console.log("MongoDB Conected", process.env.DBNAME!);
  } catch (error) {
    console.error("Error connecting DB");
  }
}

export const connectDB = main;

export const disconnectDB = () => connection.close();

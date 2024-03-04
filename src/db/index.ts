import mongoose from "mongoose";

let isConnected = false;
const { MONGODB_URI } = process.env;

if (!MONGODB_URI) {
  throw new Error("Mongodb uri does not exist in env");
}

const connectDB = async () => {
  mongoose.set('strictQuery',true);
  if (!isConnected) {
    try {
      const { connection } = await mongoose.connect(MONGODB_URI as string, {
        dbName:"shared_prompt"
      });

      if (connection.readyState === 1) {
        return Promise.resolve(true);
      }

      isConnected = true;
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

export { connectDB }


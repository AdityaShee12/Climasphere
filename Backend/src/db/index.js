import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connectionInstants = await mongoose.connect(
      `${process.env.MONGODB_URI}`
    );
    console.log(
      `\n MongoDB connected !! DB host : ${connectionInstants.connection.host}`
    );
  } catch (error) {
    console.log("MONGODB connection failed", error);
    process.exit(1);
  }
};

export default connectDB;

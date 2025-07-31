import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      "mongodb://root:example@localhost:27017/",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(error);
    console.log("connection failed");
    process.exit(1); // Exit process with failure
  }
};


export default connectDB;
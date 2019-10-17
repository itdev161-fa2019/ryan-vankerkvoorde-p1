import mongoose from "mongoose";
import config from "config";

//Get Connection string
const db = config.get("mongoURI");

//Connect to MongoDB
const connectDatabase = async () => {
  try {
    await mongoose.connect(db, {
      useUnifiedTopology: true
    });
    console.log("Connected to MongoDB");

  } catch (error) {
    console.error(error.messge);

    //exit with failure code
    process.exit(1);
  }
};

export default connectDatabase;

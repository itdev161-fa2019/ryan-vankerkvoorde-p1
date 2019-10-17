import mongoose from "mongoose";
import config from "config";

//Get Connection string
const db = config.get("mongoURI");


export default connectDatabase;

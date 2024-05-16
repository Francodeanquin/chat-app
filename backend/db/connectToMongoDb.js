import mongoose from "mongoose";

export const connecToMongoDb = async ()=>{
try {
    await mongoose.connect(process.env.MONGO_DB_URI)
    console.log("Connected to mongoDb");

} catch (error) {
    console.log("Error connecting to MongoDB", error.message )
}

}
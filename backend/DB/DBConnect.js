import mongoose from "mongoose";
const dbConnect = async()=>{
    try{
        console.log(process.env.MONGO_URL)
        await mongoose.connect(process.env.MONGO_URL);
        console.log("connected");
    }catch(error){
        console.log(error);
    }
}

export default dbConnect;
import mongoose from 'mongoose';

export async function getDbConnection() {
    mongoose.connect(process.env.MONGO_DB_URL).then(()=>{
        console.log("Connected to DB");
    }).catch((err)=>{
        console.log(err);
        console.log("Error in Connecting to DB");
    })
}
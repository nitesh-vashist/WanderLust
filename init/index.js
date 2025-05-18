require("dotenv").config({ path: "../.env" }); // 👈 points to the correct file

    
     
const mongoose = require("mongoose");
const Listing = require("../models/listing");

const db_url = process.env.ATLASDB_URL;
const initData = require("./data");

main().then(()=>{
    console.log("Connected to DB");
})
.catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(db_url);
};

const initDB = async()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj,owner:"682997cb7b9d80989c8da2dd"}));
    await Listing.insertMany(initData.data);
    console.log("Database was initialized !");
};

initDB();
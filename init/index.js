const mongoose=require("mongoose");
const initData=require("./databs.js");
const Listing=require("../models/listing.js");

main().then(()=>{
    console.log("Connection establish with mongoose")
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/airbnb');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

const initDB=async()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:"6a11d7768a8d3f61975126e7"}));
    await Listing.insertMany(initData.data);
    console.log("data initiallized");
}
initDB();
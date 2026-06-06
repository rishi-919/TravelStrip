const mongoose=require("mongoose");
const Schema=mongoose.Schema;



const listingschema=new Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
   image: {
    filename: String,
    url: {
        type: String,
        set: (v) =>
            v === ""
            ? "https://static.vecteezy.com/system/resources/previews/005/720/408/original/crossed-image-icon-picture-not-available-delete-picture-symbol-free-vector.jpg"
            : v
    }
},
    price:{
        type:Number,
        required:true,
    },
    country:
    {
        type:String,
        required:true,
    },
    location:{
        type:String,
        required:true,
    },

    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review",

        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },

});

const Listing=mongoose.model("listing",listingschema);
module.exports=Listing;

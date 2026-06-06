const express = require("express");
const router = express.Router();
const wrapAsync = require("../utiles/wrapAsync.js");
const ExpressError = require("../utiles/ExpressError.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner } = require("../middleware.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const flash = require("connect-flash");
const { index } = require("../controller/listing.js");
const listingController = require("../controller/listing.js");
const multer  = require('multer')
const{storage}=require("../cloudconfig.js")
const upload = multer({ storage });




// index route
router.get("/", wrapAsync(listingController.index));

// show route
router.get("/:id/show", wrapAsync(listingController.show));

// edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.editForm),
);

// edit-update route
router.put(
  "/:id/update",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.editUpdate),
);

// delete route
router.get(
  "/:id/delete",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.delete),
);

// new listing
router.get("/addnew", isLoggedIn, (req, res) => {
  res.render("listings/addnew.ejs");
});
// new-add listing
router.post("/", isLoggedIn,upload.single("listing[image]"), wrapAsync(listingController.addListing));

// app.get("/listing",async(req,res)=>{
//     const sampleListing=new Listing({
//   title:"My New Villa",
//   description:"The Best Villa in Goa",
//    price:
//    4000,
//    country:"India",
//     });
//     // await sampleListing.save();
//     console.log(sampleListing);
//     res.send("sucessful");

// });

module.exports = router;

const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  // res.send(allListings);
  res.render("listings/index.ejs", { allListings });
};

module.exports.show = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  console.log(listing);

  // res.send(allListings);
  if (!listing) {
    req.flash("error", "Listing Does not Exist!");
    return res.redirect("/listings");
  }

  const isOwner =
    req.user &&
    listing.owner &&
    listing.owner._id &&
    listing.owner._id.equals(req.user._id);

  res.render("listings/show", {
    listing,
    currentUser: req.user,
    isOwner,
  });
};

module.exports.editForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing Does not Exist!");
    return res.redirect("/listings");
  }
  res.render("listings/edit.ejs", { listing });
};

module.exports.editUpdate = async (req, res) => {
  let { id } = req.params;

  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  req.flash("success", "Listing Updated!");

  res.redirect(`/listings/${id}/show`);
};

module.exports.delete = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findByIdAndDelete(id);
  console.log(listing);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};

module.exports.addListing = async (req, res, next) => {
  // let{title,description,price,image,country}=req.body;
   let url=req.file.path;
   let filename=req.file.filename;
  //  console.log(url,"..",filename);
  
  const newlisting = new Listing(req.body.listing);
  newlisting.owner = req.user._id;
  newlisting.image={url,filename};
  await newlisting.save();
  console.log(newlisting);
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};

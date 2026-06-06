const Listing = require("./models/listing.js");
const ExpressError = require("./utiles/ExpressError.js");
const Review = require("./models/reviews.js");
const { reviewSchema, listingSchema } = require("./models/reviews.js");

module.exports.isLoggedIn = (req, res, next) => {
  // console.log(req.user);
  if (!req.isAuthenticated()) {
    req.flash("error", "you must be logged in to create listing!");
     return res.redirect("/users/login");
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;

  let listing = await Listing.findById(id);

  if (!listing.owner.equals(req.user._id)) {
    req.flash("error", "You don't have permission");
    return res.redirect(`/listings/${id}/show`);
  }

  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;

  let review = await Review.findById(reviewId);

  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You don't have permission");
    return res.redirect(`/listings/${id}/show`);
  }

  next();
};

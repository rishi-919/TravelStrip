const express = require("express");
const router = express.Router({ mergeParams: true });

const { isLoggedIn, isOwner, isReviewAuthor } = require("../middleware.js");
const wrapAsync = require("../utiles/wrapAsync.js");
const Listing = require("../models/listing.js");
const Review = require("../models/reviews.js");
const reviewController = require("../controller/reviews.js");

// reviews
router.post("/", isLoggedIn, wrapAsync(reviewController.createReview));

// delete review
router.delete(
  "/:reviewId",
  isLoggedIn,
  isOwner,
  isReviewAuthor,
  wrapAsync(reviewController.destroyReview),
);
module.exports = router;

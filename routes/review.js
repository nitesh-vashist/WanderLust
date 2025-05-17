const express = require("express");
const router = express.Router({mergeParams:true});
const Listing = require("../models/listing");
const Review = require("../models/review");
const { isLoggedIn, isReviewAuthor } = require("../middleware");
const reviewController = require("../controllers/review");

// New Review Post route

router.post("/",isLoggedIn,reviewController.createReview);

// Review Delete route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,reviewController.deleteReview);

module.exports = router;
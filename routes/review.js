const express = require("express");
const router = express.Router({mergeParams:true});
const Listing = require("../models/listing");
const Review = require("../models/review");
// New Review Post route

router.post("/",async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();

    
    req.flash("success","New Review Created!");
    res.redirect(`/listings/${listing._id}`);
});

// Review Delete route
router.delete("/:reviewId",async(req,res)=>{
    let{id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted!");
    res.redirect(`/listings/${id}`);
})

module.exports = router;
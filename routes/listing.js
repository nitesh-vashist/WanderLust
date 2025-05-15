const express = require("express");
const router = express.Router();
const {listingSchema} = require("../schema.js");
const Listing = require("../models/listing");


router.get("/",async (req,res)=>{
    let allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
});

router.get("/new",async(req,res)=>{
    res.render("listings/new.ejs");
});

router.get("/:id/edit",async(req,res)=>{
    let{id}  = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for , do not exists!");
        res.redirect("/listings");
    };
    res.render("listings/edit.ejs",{listing});
})
//Show route
router.get("/:id",async(req,res)=>{
    let{id}  = req.params;
    let listing = await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error","Listing you requested for , do not exists!");
        res.redirect("/listings");
    };
    res.render("listings/oneListing.ejs",{listing});
});
//Create Route
router.post("/new",async(req,res,next)=>{
   
     // let newListing = new Listing(req.body.listing);
    // await newListing.save();
   
    const { listing } = req.body;
listing.image = {
    url: listing.image,
    filename: "userUploaded" // or handle properly if using Multer/Cloudinary
};
const newListing = new Listing(listing);
await newListing.save();
req.flash("success","New Listing Created!");
    res.redirect("/listings");
  
});

//Update route
router.put("/:id/edit",async(req,res)=>{
    // let newListing = new Listing(req.body.listing);
    // await newListing.save();
    // res.redirect(`/listings`);
    let{id} =req.params;
    // await Listing.findByIdAndUpdate(id,{...req.body.listing});
    const { listing } = req.body;
    listing.image = {
      url: listing.image,        // assuming form gives just the URL string
      filename: "userEdited"
    };
    
    await Listing.findByIdAndUpdate(id, {
      title: listing.title,
      description: listing.description,
      price: listing.price,
      location: listing.location,
      country: listing.country,
      image: listing.image // ✅ overwrite entire object
    });
    
    req.flash("success","Listing updated!");
    res.redirect("/listings");
});

//Delete Route
router.delete("/:id",async(req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
})


module.exports = router;
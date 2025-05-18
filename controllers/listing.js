require("dotenv").config({ path: "../.env" }); 

const Listing = require("../models/listing");

module.exports.index = async (req,res)=>{
    let allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
};

module.exports.renderNewForm = async(req,res)=>{
   
    res.render("listings/new.ejs");
};

module.exports.showListing =async(req,res)=>{
    let{id}  = req.params;
    let listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author",}}).populate("owner");
    if(!listing){
        req.flash("error","Listing you requested for , do not exists!");
        res.redirect("/listings");
    };
    res.render("listings/oneListing.ejs",{listing,razorpayKey: process.env.RAZORPAY_KEY_ID });
};

module.exports.createListing = async(req,res,next)=>{
   
     // let newListing = new Listing(req.body.listing);
    // await newListing.save();
    let url = req.file.path;
    let filename = req.file.filename;
    const { listing } = req.body;

    const newListing = new Listing(listing);

    // listing.image = {
    // url: listing.image,
    // filename: "userUploaded" // or handle properly if using Multer/Cloudinary
    // };
    newListing.image = {url,filename};
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
  
};

module.exports.renderEditForm = async(req,res)=>{
    let{id}  = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for , do not exists!");
        res.redirect("/listings");
    };
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/c_fill,h_300,w_250");
    res.render("listings/edit.ejs",{listing,originalImageUrl});
};

module.exports.updateListing = async(req,res)=>{
    // let newListing = new Listing(req.body.listing);
    // await newListing.save();
    // res.redirect(`/listings`);
    let{id} =req.params;
    // await Listing.findByIdAndUpdate(id,{...req.body.listing});
    // const { listing } = req.body;
    // listing.image = {
    //   url: listing.image,        // assuming form gives just the URL string
    //   filename: "userEdited"
    // };
    
   
    // await Listing.findByIdAndUpdate(id, {
    //   title: listing.title,
    //   description: listing.description,
    //   price: listing.price,
    //   location: listing.location,
    //   country: listing.country,
    //   image:{url,filename} // ✅ overwrite entire object
    // });

    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url,filename};
        await listing.save();
    }
    
    req.flash("success","Listing updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async(req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
};
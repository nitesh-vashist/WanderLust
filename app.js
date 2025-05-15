const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
let port = 8080;
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const {listingSchema} = require("./schema.js");
const Review = require("./models/review");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js")
const session = require("express-session");
const flash = require("connect-flash");

app.engine("ejs",ejsMate);

app.use(methodOverride("_method"));

app.set("views engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"/public")));


const sessionOptions = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
    },
    httpOnly : true,
};
app.use(session(sessionOptions));
app.use(flash());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})

app.use("/listings",listings);
app.use("/listings/:id/review",reviews);
main().then(()=>{
    console.log("Connected to DB");
})
.catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
};

app.get("/",async(req,res)=>{
    res.render("listings/home.ejs");
});

const validateListing = (req,res,next)=>{
     let {error}= listingSchema.validate(req.body);
  
    if(error){
        throw new error("send all field data")
    }else{
        next();
    }

};

// app.get("/testListing",async (req,res)=>{
//     let sampleListing = new Listing({
//         title : "My new Villa",
//         description : "By the Beach",
//         price : 1200,
//         location : "Calangute,Goa",
//         country : "India",
//     });
//     await sampleListing.save();
//     console.log("sample was saved!");
//     res.send("Successful testing");
// });

// app.get("/listings",async (req,res)=>{
//     let allListings = await Listing.find({});
//     res.render("listings/index.ejs",{allListings});
// });

// app.get("/listings/new",async(req,res)=>{
//     res.render("listings/new.ejs");
// });

// app.get("/listings/:id/edit",async(req,res)=>{
//     let{id}  = req.params;
//     let listing = await Listing.findById(id);
//     res.render("listings/edit.ejs",{listing});
// })
// //Show route
// app.get("/listings/:id",async(req,res)=>{
//     let{id}  = req.params;
//     let listing = await Listing.findById(id).populate("reviews");
//     res.render("listings/oneListing.ejs",{listing});
// });
// //Create Route
// app.post("/listings/new",async(req,res,next)=>{
   
//      // let newListing = new Listing(req.body.listing);
//     // await newListing.save();
   
//     const { listing } = req.body;
// listing.image = {
//     url: listing.image,
//     filename: "userUploaded" // or handle properly if using Multer/Cloudinary
// };
// const newListing = new Listing(listing);
// await newListing.save();
//     res.redirect("/listings");
  
// });

// //Update route
// app.put("/listings/:id/edit",async(req,res)=>{
//     // let newListing = new Listing(req.body.listing);
//     // await newListing.save();
//     // res.redirect(`/listings`);
//     let{id} =req.params;
//     // await Listing.findByIdAndUpdate(id,{...req.body.listing});
//     const { listing } = req.body;
//     listing.image = {
//       url: listing.image,        // assuming form gives just the URL string
//       filename: "userEdited"
//     };
    
//     await Listing.findByIdAndUpdate(id, {
//       title: listing.title,
//       description: listing.description,
//       price: listing.price,
//       location: listing.location,
//       country: listing.country,
//       image: listing.image // ✅ overwrite entire object
//     });
    

//     res.redirect("/listings");
// });

// //Delete Route
// app.delete("/listings/:id",async(req,res)=>{
//     let {id} = req.params;
//     let deletedListing = await Listing.findByIdAndDelete(id);
//     console.log(deletedListing);
//     res.redirect("/listings");
// })

// New Review Post route

// app.post("/listings/:id/review",async(req,res)=>{
//     let listing = await Listing.findById(req.params.id);
//     let newReview = new Review(req.body.review);

//     listing.reviews.push(newReview);
//     await newReview.save();
//     await listing.save();

//     console.log("new review saved");
//     res.redirect(`/listings/${listing._id}`);
// });

// // Review Delete route
// app.delete("/listings/:id/review/:reviewId",async(req,res)=>{
//     let{id,reviewId} = req.params;
//     await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
//     await Review.findByIdAndDelete(reviewId);
    
//     res.redirect(`/listings/${id}`);
// })

// app.all("*",(req,res,next)=>{
//     res.send("page not found");
// });

// app.use((err,req,res,next)=>{
//     res.send("something went wrong!");
// })

app.listen(port,()=>{
    console.log("Listening on port:",port);
});
if(process.env.NODE_ENV!="production"){
    require("dotenv").config();
};


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
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const paymentRoutes = require("./routes/paymentRoutes.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");




app.engine("ejs",ejsMate);

app.use(methodOverride("_method"));

app.set("views engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"/public")));
const db_url = process.env.ATLASDB_URL;
const store = MongoStore.create({
    mongoUrl : db_url,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter: 24*3600,
});

store.on("error",()=>{
    console.log("ERROR in MONGO SESSION STORE",err);
});

const sessionOptions = {
    store,
    secret: process.env.SECRET,
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

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})
app.use(express.json());
app.use("/listings",listingsRouter);
app.use("/listings/:id/review",reviewsRouter);
app.use("/",userRouter);
app.use("/", paymentRoutes);



main().then(()=>{
    console.log("Connected to DB");
})
.catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(db_url);
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


app.listen(port,()=>{
    console.log("Listening on port:",port);
});
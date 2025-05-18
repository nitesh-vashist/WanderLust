const express = require("express");
const router = express.Router();
const {listingSchema} = require("../schema.js");
const Listing = require("../models/listing");

const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});
const {isLoggedIn, isOwner} = require("../middleware.js")

const listingController = require("../controllers/listing.js");

// Index route
router.get("/",listingController.index);

// New Listing Form
router.get("/new",isLoggedIn,listingController.renderNewForm);

// Edit Listing Form
router.get("/:id/edit",isLoggedIn,isOwner,listingController.renderEditForm);

//Show route
router.get("/:id",listingController.showListing);
//Create Route
router.post("/new",isLoggedIn,upload.single("listing[image]"),listingController.createListing);

//Update route
router.put("/:id/edit",isLoggedIn,isOwner,upload.single("listing[image]"),listingController.updateListing);

//Delete Route
router.delete("/:id",isLoggedIn,isOwner,listingController.deleteListing);


module.exports = router;
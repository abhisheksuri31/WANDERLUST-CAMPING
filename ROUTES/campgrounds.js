//REQUIRE
const express = require("express");
const router = express.Router();

//MULTER,CLOUDINARY
const multer = require("multer");
const { storage } = require("../CLOUDINARY");
const upload = multer({ storage });
const catchasync = require("../UTILITIES/catchasync");
const { isloggedin, isauthor, validatecampground } = require("../middleware");

//CONTROLLER
const campgroundscontroller = require("../CONTROLLERS/campgrounds");


//ROUTES

router.route("/")
    //ALL CAMPGROUNDS
    .get(campgroundscontroller.INDEX)

    //CREATE CAMPGROUND
    .post(isloggedin, upload.array("image"), validatecampground, campgroundscontroller.CREATECAMPGROUND);



//RENDER NEW CAMPGROUND FORM
router.get("/new", isloggedin, campgroundscontroller.RENDERNEWFORM);


router.route("/:id")
    //SHOW PARTICULAR CAMPGROUND
    .get(campgroundscontroller.SHOWCAMPGROUND)

    //EDIT CAMPGROUND
    .put(isloggedin, isauthor, upload.array("image"), validatecampground, campgroundscontroller.UPDATECAMPGROUND)

    //DELETE CAMPGROUND
    .delete(isloggedin, isauthor, campgroundscontroller.DELETECAMPGROUND);



//RENDER EDIT CAMPGROUND FORM
router.get("/:id/edit", isloggedin, isauthor, campgroundscontroller.RENDEREDITFORM);


module.exports = router;
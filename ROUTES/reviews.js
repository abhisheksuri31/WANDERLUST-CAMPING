const express = require("express");
const router = express.Router({ mergeParams: true });

const { validatereview ,isloggedin , isreviewauthor} = require("../middleware");


//CONTROLLER
const reviewscontroller = require("../CONTROLLERS/reviews");



//ROUTES
//CREATE REVIEW
router.post("/", isloggedin ,validatereview, reviewscontroller.CREATEREVIEW);

//DELETE REVIEW
router.delete("/:reviewid", isloggedin, isreviewauthor ,reviewscontroller.DELETEREVIEW);


module.exports = router;

const express = require("express");
const router = express.Router();
const catchasync = require("../UTILITIES/catchasync");
const customerror = require("../UTILITIES/customerror");
const passport = require("passport");
const User = require("../MODELS/user");

//CONTROLLER
const userscontroller = require("../CONTROLLERS/users");


//ROUTES

router.route("/register")
    //RENDER REGISTER FORM
    .get(userscontroller.REGISTERFORM)

    //REGISTERS A USER
    .post(userscontroller.REGISTERAUSER);


router.route("/login")
    //RENDER LOGIN FORM
    .get(userscontroller.LOGINFORM)

    //LOGINS A USER
    .post(passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), userscontroller.LOGINAUSER);


//LOGOUT A USER
router.get("/logout", userscontroller.LOGOUTAUSER)

module.exports = router;
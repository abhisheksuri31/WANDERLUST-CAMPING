//REQUIRE
//DOTENV
if (process.env.NODE_ENV !== "production") {//DEVELOPMENT MODE RIGHT NOW
    require("dotenv").config();
}


//EXPRESS,MONGOOSE
const express = require("express");
const app = express();
const path = require("path");
const ejsmate = require("ejs-mate");
const methodoverride = require("method-override");
const mongoose = require("mongoose");

//MONGOOSE CONNECTION
const DB_URL = process.env.MONGODB_ATLAS || "mongodb://localhost:27017/YELP-CAMP";
mongoose.connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => {
    console.log("DATABASE CONNECTED");
}).catch((err) => {
    console.log("ERROR");
    console.log(err);
})

//SESSION,FLASH
const session = require("express-session");
const flash = require("connect-flash");
const mongosessionstore = require("connect-mongo");

//PASSPORT
const passport = require('passport');
const localstrategy = require('passport-local');

//SECURITY
const mongosanitize = require("express-mongo-sanitize");

const User = require("./MODELS/user");


//MIDDLEWARES
//CONFIGURING APP
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/PUBLIC")));
app.use(methodoverride("_method"));
app.engine("ejs", ejsmate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/VIEWS"));

const secret=process.env_SECRET || "thisismylittlesecretplsdonttellanyone";

const store = mongosessionstore.create({
    mongoUrl: DB_URL,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret,
    }
});

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
});


app.use(session({
    store,
    //SECURITY
    name: "COOKING",
    secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        //SECURITY HTTPS
        // secure:true,
        //DATE.NOW() => MILLISECONDS
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000
    }
}));


//SECURITY
app.use(mongosanitize({ replaceWith: '_' }));

//CONFIGURING PASSPORT
app.use(passport.initialize());
app.use(passport.session());
//STATIC METHODS ADDED AUTOMATICALLY BY PASSPORT-LOCAL-MONGOOSE
passport.use(new localstrategy(User.authenticate()));//USER MODEL
passport.serializeUser(User.serializeUser());//STORE USER IN A SESSION
passport.deserializeUser(User.deserializeUser());//GET USER OUT OF THAT SESSION


//FLASH
app.use(flash());
//FLASH ERRORS
//GLOBAL , AVAILABLE IN EVERY TEMPLATE
app.use((req, res, next) => {
    if (!["/login", "/"].includes(req.originalUrl)) {
        req.session.returnto = req.originalUrl;
    }
    res.locals.successflash = req.flash("success");
    res.locals.errorflash = req.flash("error");
    res.locals.currentuser = req.user;
    next();
});


//ERRORS
const catchasync = require("./UTILITIES/catchasync");
const customerror = require("./UTILITIES/customerror");

//ROUTES
const campgroundroutes = require("./ROUTES/campgrounds");
const reviewroutes = require("./ROUTES/reviews");
const userroutes = require("./ROUTES/users");

//USING ROUTES
app.use("/campgrounds", campgroundroutes);
app.use("/campgrounds/:id/reviews", reviewroutes);
app.use("/", userroutes);




app.get("/", (req, res) => {
    res.render("home");
});



//ROUTE NOT DEFINED
app.all("*", (req, res, next) => {
    throw new customerror(404, "PAGE NOT FOUND !");
})

//ERROR
app.use((err, req, res, next) => {
    const { status = 500, message = "SOMETHING WENT WRONG !" } = err;
    if (!err.message) {
        err.message = "OH BOY ! SOMETHING WENT WRONG !"
    }

    res.status(status).render("error", { err });
});

const port=process.env.PORT || 3000;
//LISTENING PORT
app.listen(port, () => {
    console.log(`SERVER RUNNING AT PORT ${port}`);
});
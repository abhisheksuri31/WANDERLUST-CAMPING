const User = require("../MODELS/user");
const catchasync = require("../UTILITIES/catchasync");

//CONTROLLERS
//RENDER REGISTER FORM
module.exports.REGISTERFORM = (req, res) => {
    res.render("USERS/register");
};

//REGISTERS A USER
module.exports.REGISTERAUSER = catchasync(async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registereduser = await User.register(user, password);
        req.login(registereduser, (err) => {
            if (err) {
                next(err);
            } else {
                req.flash("success", "Welcome to Yelp Camp !");
                res.redirect('/campgrounds');
            }
        });

    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/register");
    }
});

//RENDER LOGIN FORM
module.exports.LOGINFORM = (req, res) => {
    res.render("USERS/login");
};

//LOGINS A USER
module.exports.LOGINAUSER = (req, res) => {
    const redirecturl = req.session.returnto || "/campgrounds";
    req.flash("success", "welcome back !");
    res.redirect(redirecturl);
};

//LOGOUT A USER
module.exports.LOGOUTAUSER = (req, res) => {
    req.logout();
    req.flash("success", "Goodbye !");
    res.redirect("/campgrounds");
};
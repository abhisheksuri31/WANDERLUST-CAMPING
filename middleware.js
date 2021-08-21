const { campgroundschema, reviewschema } = require('./joischemas.js');
const customerror = require('./UTILITIES/customerror');
const Campground = require('./MODELS/campground');
const Review = require('./MODELS/review');


module.exports.isloggedin = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();

    } else {
        req.flash('error', 'You must be signed in first !');
        res.redirect('/login');
    }
}


//JOI
module.exports.validatecampground = (req, res, next) => {
    const result = campgroundschema.validate(req.body);

    if (result.error) {
        // console.log(result);
        // console.log(result.error);
        // console.log(result.error.details); ARRAY OF OBJECTS
        // console.log(result.error.details[0].message);
        // res.send(result.error.details[0].message.toUpperCase());
        const message = result.error.details.map(el => el.message).join(","); //THERE CAN BE MORE THAN 1 ERROR
        throw new customerror(400, message.toUpperCase());

    }
    else {
        next();
    }
};


module.exports.isauthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that !');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.isreviewauthor = async (req, res, next) => {
    const { id, reviewid } = req.params;
    const review = await Review.findById(reviewid);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that !');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}


module.exports.validatereview = (req, res, next) => {
    const result = reviewschema.validate(req.body);

    if (result.error) {

        const message = result.error.details.map(el => el.message).join(","); //THERE CAN BE MORE THAN 1 ERROR
        throw new customerror(400, message.toUpperCase());

    }
    else {
        next();
    }
};
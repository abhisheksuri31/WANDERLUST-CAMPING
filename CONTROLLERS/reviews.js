const Review = require("../MODELS/review");
const Campground = require("../MODELS/campground");

//CONTROLLERS
//CREATE REVIEW
module.exports.CREATEREVIEW = async (req, res, next) => {

    try {

        const campground = await Campground.findById(req.params.id);
        const review = new Review(req.body);
        review.author = req.user._id;
        campground.reviews.push(review);
        await review.save();
        await campground.save();
        req.flash("success", "SUCCESSFULLY CREATED review !");

        res.redirect(`/campgrounds/${campground._id}`);


    } catch (err) {
        next(err);
    }
};

//DELETE REVIEW
module.exports.DELETEREVIEW = async (req, res, next) => {

    try {
        const { id, reviewid } = req.params;
        await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewid } });
        await Review.findByIdAndDelete(reviewid);
        req.flash("success", "SUCCESSFULLY deleted review !");
        res.redirect(`/campgrounds/${id}`);

    } catch (err) {
        next(err);
    }

};
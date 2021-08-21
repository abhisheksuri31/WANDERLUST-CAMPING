const Campground = require("../MODELS/campground");
const { cloudinary } = require("../CLOUDINARY");//CLOUDINARY


//MAPBOX
const mapboxgeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const geocoder = mapboxgeocoding({ accessToken: process.env.MAPBOX_TOKEN });

//CONTROLLERS
//ALL CAMPGROUNDS
module.exports.INDEX = async (req, res, next) => {
    try {
        const campgrounds = await Campground.find({});
        res.render("CAMPGROUNDS/index", { campgrounds });
    } catch (err) {
        next(err);
    }

}

//RENDER NEW CAMPGROUND FORM
module.exports.RENDERNEWFORM = (req, res) => {
    res.render("CAMPGROUNDS/new");
};

//CREATE CAMPGROUND
module.exports.CREATECAMPGROUND = async (req, res, next) => {

    try {
        const geodata = await geocoder.forwardGeocode({
            query: req.body.location,
            limit: 1
        }).send();
        const campground = new Campground(req.body);
        campground.geometry = geodata.body.features[0].geometry;
        if (!campground.geometry) {
            next(err);
        } else {
            campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
            campground.author = req.user._id;
            await campground.save();
            req.flash("success", "SUCCESSFULLY CREATED CAMPGROUND !");
            res.redirect(`/campgrounds/${campground._id}`);
        }

    } catch (err) {
        req.flash("error", "cannot fetch that location , please enter a valid location !");
        res.redirect(`/campgrounds/new`);
    }

};


//SHOW PARTICULAR CAMPGROUND
module.exports.SHOWCAMPGROUND = async (req, res, next) => {
    try {
        const campground = await Campground.findById(req.params.id).populate({
            path: 'reviews',
            populate: {
                path: 'author'
            }
        }).populate("author");
        if (!campground) {
            req.flash("error", "cannot find that campground !");
            return res.redirect("/campgrounds");
        }
        res.render("CAMPGROUNDS/show", { campground });
    }
    catch (err) {
        next(err);
    }
};

//RENDER EDIT CAMPGROUND FORM
module.exports.RENDEREDITFORM = async (req, res, next) => {
    try {
        const campground = await Campground.findById(req.params.id);
        if (!campground) {
            req.flash("error", "cannot find that campground !");
            return res.redirect("/campgrounds");
        }
        res.render("CAMPGROUNDS/edit", { campground });
    } catch (err) {
        next(err);
    }

};

//EDIT CAMPGROUND
module.exports.UPDATECAMPGROUND = async (req, res, next) => {
    try {
        const campground = await Campground.findByIdAndUpdate(req.params.id, { ...req.body });
        const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
        campground.images.push(...imgs);
        await campground.save();
        if (req.body.deleteimages) {
            for (let filename of req.body.deleteimages) {
                await cloudinary.uploader.destroy(filename);
            }
            await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteimages } } } })
        }
        req.flash("success", "SUCCESSFULLY UPDATED CAMPGROUND !");
        res.redirect(`/campgrounds/${campground._id}`);
    } catch (err) {
        next(err);
    }
};

//DELETE CAMPGROUND
module.exports.DELETECAMPGROUND = async (req, res, next) => {
    try {
        const campground = await Campground.findByIdAndDelete(req.params.id);
        req.flash("success", "SUCCESSFULLY DELETED CAMPGROUND !");
        res.redirect("/campgrounds");
    } catch (err) {
        next(err);
    }
};
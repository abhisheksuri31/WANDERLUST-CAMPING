//REQUIRE
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

//CONFIG
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

//STORAGE
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "YELP-CAMP",
        allowedformats: ["jpeg", "jpg", "png"]
    }

});

//EXPORTING
module.exports = { cloudinary, storage };
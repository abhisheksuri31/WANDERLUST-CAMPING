if (process.env.NODE_ENV !== "production") {//DEVELOPMENT MODE RIGHT NOW
    require("dotenv").config();
}
const mongoose = require("mongoose");
const Campground = require("../MODELS/campground");

const finalcities = require("./finalcities");
const cities = require("./cities");

const { descriptors, places } = require("./seedhelpers");


const DB_URL = process.env.MONGODB_ATLAS || "mongodb://localhost:27017/YELP-CAMP";

mongoose.connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => {
    console.log("DATABASE CONNECTED");
}).catch((err) => {
    console.log("ERROR");
    console.log(err);
})


const sample = array => array[Math.floor(Math.random() * array.length)];

const seeddb = async () => {

    await Campground.deleteMany({});

    for (let i = 1; i <= 430; i++) {
        const random1000 = Math.floor(Math.random() * 430) + 1;
        const price = Math.floor(Math.random() * 20 + 10);
        const camp = new Campground({
            author: "60a37e1bcf5682001517e64e",
            
            location: `${finalcities[random1000].city},${finalcities[random1000].country}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Harum sed labore sequi, necessitatibus reprehenderit quasi consectetur, itaque repudiandae eveniet quibusdam voluptatum quia id rerum vel iure autem ullam repellat. Assumenda nostrum veniam libero sed dolorem itaque mollitia eveniet, sint exercitationem quidem praesentium deleniti eos maxime, neque architecto illum possimus omnis.",
            price,
            geometry: { type: "Point", coordinates: [finalcities[random1000].lang, finalcities[random1000].lat] },
            images: [
                { url: "https://res.cloudinary.com/cloudsuri/image/upload/v1621317596/YELP-CAMP/ztzwyqwdbs53mcwqpki9.jpg", filename: "YELP-CAMP/ztzwyqwdbs53mcwqpki9" },

                { url: "https://res.cloudinary.com/cloudsuri/image/upload/v1621317597/YELP-CAMP/ok5obsaspmoqlpxv661r.jpg", filename: "YELP-CAMP/ok5obsaspmoqlpxv661r" }
            ]

        });
        await camp.save();
    }

};

seeddb().then(() => {
    mongoose.connection.close();
});
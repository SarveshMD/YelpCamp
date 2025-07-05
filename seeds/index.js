const mongoose = require('mongoose');

const { descriptors, places } = require('./helpers.js')
const locations = require('./locations.js')
const Campground = require('../models/campgrounds')
require('dotenv').config();

mongoose.connect('mongodb://localhost:27017/yelp-camp')

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("MongoDB Connected...")
});

const getRandomElement = (arr) => {
    return arr[Math.floor(Math.random() * arr.length)];
}

const seedDB = async () => {
    await Campground.deleteMany({});
    const images = await getImages('Nature camping sites', process.env.PEXELS_API);
    for (let i = 0; i < 50; i++) {
        const randLocation = getRandomElement(locations);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            title: `${getRandomElement(descriptors)} ${getRandomElement(places)}`,
            image: images[i].src.medium,
            location: `${randLocation.city}, ${randLocation.state}`,
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio, alias? Excepturi eos commodi ullam quod tempora, doloremque saepe aliquam velit error cum pariatur earum, fugit non, aliquid neque animi. Consequuntur.",
            price
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});

const getImages = async (q, API_KEY) => {
    try {

        const req = await fetch(`https://api.pexels.com/v1/search?query=${q}&per_page=50&orientation=landscape`, {
            headers: {
                Authorization: API_KEY
            }
        });
        const res = await req.json()
        return res.photos;
    }
    catch (err) {
        console.log("error:", err);
    }
};
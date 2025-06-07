const mongoose = require('mongoose');

const { descriptors, places } = require('./helpers.js')
const locations = require('./locations.js')
const Campground = require('../models/campgrounds')

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
    for (let i = 0; i < 50; i++) {
        const randLocation = getRandomElement(locations);
        const camp = new Campground({
            title: `${getRandomElement(descriptors)} ${getRandomElement(places)}`,
            location: `${randLocation.city}, ${randLocation.state}`
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});
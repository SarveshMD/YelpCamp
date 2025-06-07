const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campgrounds')

mongoose.connect('mongodb://localhost:27017/yelp-camp')

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("MongoDB Connected...")
});

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("Hey There!");
})

app.listen(3000, () => {
    console.log("Listening on port 3000...")
})
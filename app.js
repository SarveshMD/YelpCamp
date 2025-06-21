const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Campground = require('./models/campgrounds');

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
app.use(methodOverride('_method'));

app.get("/", (req, res) => {
    res.render("index");
})

app.get("/campgrounds", async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
})

app.get("/campgrounds/new", (req, res) => {
    res.render("campgrounds/new");
})

app.post("/campgrounds/new", async (req, res) => {
    const newCampground = new Campground(req.body);
    await newCampground.save();
    res.redirect(`/campgrounds/${newCampground._id}`);
})

app.get("/campgrounds/:id", async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/show", { campground });
})

app.delete("/campgrounds/:id", async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id);
    const campgrounds = Campground.find({});
    res.redirect("/campgrounds")
})

app.get("/campgrounds/:id/edit", async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/edit", { campground })
})

app.put("/campgrounds/:id", async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndUpdate(id, req.body, { runValidators: true });
    res.redirect(`/campgrounds/${id}`);
})

app.listen(3000, () => {
    console.log("Listening on port 3000...")
})
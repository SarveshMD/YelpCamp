const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Campground = require('./models/campgrounds');
const ejsMate = require('ejs-mate');
const morgan = require('morgan');

const { campgroundSchema } = require('./utils/schemas');
const ExpressError = require('./utils/ExpressError');

mongoose.connect('mongodb://localhost:27017/yelp-camp')

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("MongoDB Connected...")
});

const app = express();

app.use(morgan('dev'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.engine('ejs', ejsMate)
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(400, msg)
    }
    else {
        next();
    }
}

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

app.post("/campgrounds/new", validateCampground, async (req, res) => {

    const newCampground = new Campground({ ...req.body.campground });
    if (!newCampground) {
    }
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

app.put("/campgrounds/:id", validateCampground, async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { runValidators: true });
    res.redirect(`/campgrounds/${id}`);
})

app.all(/.*/, (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
})

app.use((err, req, res, next) => {
    console.error(err);
    const { status = 500 } = err;
    if (!err.message) err.message = "Something Went Wrong"
    res.status(status).render('error', { err });
})

app.listen(3000, () => {
    console.log("Listening on port 3000...")
})
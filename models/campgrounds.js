const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Review = require("./reviews");

const campgroundSchema = new Schema({
	title: String,
	image: String,
	price: Number,
	description: String,
	location: String,
	reviews: [
		{
			type: Schema.Types.ObjectId,
			ref: "Review",
		},
	],
});

campgroundSchema.post("findOneAndDelete", async (campground) => {
	if (campground.reviews.length) {
		await Review.deleteMany({
			_id: { $in: campground.reviews },
		});
	}
});

module.exports = mongoose.model("Campground", campgroundSchema);

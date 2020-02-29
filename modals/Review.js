const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Please add a title for the review"],
    maxlength: 100
  },
  text: {
    type: String,
    required: [true, "Please add some text"]
  },
  rating: {
    type: Number,
    min: 1,
    max: 10,
    required: [true, `Please a rating between 1 and 10`]
  },
  createdAt: {
    type: Date,
    defaut: Date.now
  },
  // integrating bootcamp modal and courses modal
  bootcamp: {
    type: mongoose.Schema.ObjectId, //needed in order to reference the related bootcamo by Id
    ref: "Bootcamp", // needed in order to identify which modal to refer to for ID matching,
    required: true
  },
  // integrating user modal and courses modal
  user: {
    type: mongoose.Schema.ObjectId, //needed in order to reference the related bootcamo by Id
    ref: "User", // needed in order to identify which modal to refer to for ID matching,
    required: true
  }
});

// prevent user from submitting more than 1 review per bootcamp
ReviewSchema.index({ bootcamp: 1, user: 1 }, { unique: true });

// Static method to get avg rating and save
ReviewSchema.statics.getAverageRating = async function(bootcampId) {
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId }
    },
    {
      $group: {
        _id: "$bootcamp",
        averageRating: { $avg: "$rating" }
      }
    }
  ]);

  try {
    await this.model("Bootcamp").findByIdAndUpdate(bootcampId, {
      averageRating: obj[0].averageRating
    });
  } catch (err) {
    console.error(err);
  }
};

// Call getAverageCost after save
ReviewSchema.pre("save", function() {
  this.constructor.getAverageRating(this.bootcamp);
});

// Call getAverageCost before remove
ReviewSchema.pre("remove", function() {
  this.constructor.getAverageRating(this.bootcamp);
});

module.exports = mongoose.model("Review", ReviewSchema);

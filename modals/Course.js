const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Please add a course title"]
  },
  description: {
    type: String,
    required: [true, "Please add a description"]
  },
  weeks: {
    type: String,
    required: [true, "Please add number of weeks"]
  },
  tuition: {
    type: Number,
    required: [true, "Please add a tuition cost"]
  },
  minimumSkill: {
    type: String,
    required: [true, "Please add a minimum skill"],
    enum: ["beginner", "intermediate", "advanced"]
  },
  scholarshipAvailable: {
    type: Boolean,
    default: false
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
  }
});

module.exports = mongoose.model("Course", CourseSchema);

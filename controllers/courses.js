const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("..//middleware/async");
const Course = require("../modals/Course");
const Bootcamp = require("../modals/Bootcamp");

// @desc    Get courses
// @route   GET /api/v1/courses
// @route   GET /api/v1/bootcamps/:bootcampId/courses
// @access  Public
exports.getCourses = asyncHandler(async (req, res, next) => {
  let query;

  if (req.params.bootcampId) {
    // if there is specific bootcamp in the query then find courses belonging to it
    query = Course.find({ bootcamp: req.params.bootcampId });
  } else {
    // if not passed in a bootcampId then getch all courses in database, and populate bootcamp info referring to modal name
    query = Course.find().populate({
      path: "bootcamp", // name of thhe property we would like to populate with using its ID info
      select: "name description" // the fields we would like to include in our response
    });
  }

  const courses = await query;
  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses
  });
});

// @desc    Get a single course
// @route   GET /api/v1/courses/:id
// @access  Public
exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: "bootcamp",
    select: "name description"
  });

  if (!course) {
    return next(
      new ErrorResponse(`No course with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: course
  });
});

// @desc    Add a  course
// @route   POST /api/v1/bootcamps/:bootcampId/courses
// @access  Private
exports.addCourse = asyncHandler(async (req, res, next) => {
  // we have to assign bootcamp field of the courses using the parameter passed in the url
  req.body.bootcamp = req.params.bootcampId;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`No bootcamp with id of ${req.params.bootcampId}`, 404)
    );
  }

  const course = await Course.create(req.body);

  res.status(200).json({
    success: true,
    data: course
  });
});

// @desc    Update a  course
// @route   PUT /api/v1/courses/:id
// @access  Private
exports.updateCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);

  if (!course) {
    return next(
      new ErrorResponse(`No course with id of ${req.params.id}`, 404)
    );
  }

  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true, //returns the new version of the course
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: course
  });
});

// @desc    Delete a  course
// @route   DELETE /api/v1/courses/:id
// @access  Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return next(
      new ErrorResponse(`No course with id of ${req.params.id}`, 404)
    );
  }

  // remove the course, we could have deleted above but we are going to use middlewares that are fired based on remove method
  await course.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

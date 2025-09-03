const express = require("express")
const router = express.Router()

//import the controllers iiii
//course controllers
const { createCourse, showAllCourses, getCourseDetails } = require("../controllers/Course")
//categories controllers
const { showAllCategories,createCategory, categoryPageDetails } = require("../controllers/Category")
//sections controllers
const { createSection, updateSection, deleteSection } = require("../controllers/Section")
//sub sections controllers
const { createSubSection, updateSubSection, deleteSubSection } = require("../controllers/Subsection")
// rating controllers
const { createRating, getAverageRating, getAllRating } = require("../controllers/RatingAndReview")

//import middlewares 
const { auth, isInstructor, isStudent, isAdmin } = require("../middleware/auth")


//course routes
// courses can only be created by instructor, so add middleware
router.post("/createCourse", auth, isInstructor, createCourse)


//add a section to a course
router.post("/addSection", auth, isInstructor, createSection)
// update a section
router.post("/updateSection", auth, isInstructor, updateSection)
// delete a section
router.post("/deleteSection", auth, isInstructor, deleteSection)


//add a sub section to a section
router.post("/addSubSection", auth, isInstructor, createSubSection)
//update a sub section
router.post("/updateSubSection", auth, isInstructor, updateSubSection)
// delete sub section
router.post("/deleteSubSection", auth, isInstructor, deleteSubSection)

//get all courses
router.get("/getAllCourses", showAllCourses)
// get details for a specific course
router.post("/getCourseDetails", getCourseDetails)
// router.post("/getFullCourseDetails", auth, getFullCourseDetails)
// // Edit Course routes
// router.post("/editCourse", auth, isInstructor, editCourse)
// // Get all Courses Under a Specific Instructor
// router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses)
// // Delete a Course
// router.delete("/deleteCourse", deleteCourse)

// category can only be created by admin

router.post("/createCategory", auth, isAdmin, createCategory)
router.get("/showAllCategories", showAllCategories)
router.post("/getCategoryPageDetails", categoryPageDetails)

router.post("/createRating", auth, isStudent, createRating)
router.get("/getAverageRating", getAverageRating)
router.get("/getReviews", getAllRating)

module.exports = router
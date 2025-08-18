const express = require("express");
const router = express.Router()
const { auth } = require("../middleware/auth")
const { deleteAccount, updateProfile, getAllUserDetails,
     updateDisplayPicture, getEnrolledCourses } = require("../controllers/Profile")

//get user details
router.get("/getUserDetails", auth, getAllUserDetails)
//update user details
router.put("/updateProfile", auth, updateProfile)
//delete user details
router.delete("/deleteProfile", auth, deleteAccount)
// get enrolled Courses
router.get("/getEnrolledCourses", auth, getEnrolledCourses)
router.put("/updateDisplayPicture", auth, updateDisplayPicture)

module.exports = router
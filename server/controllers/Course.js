const Course = require("../models/Course");
const Category = require("../models/Category");
const User = require("../models/User");
const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const {uploadImageToCloudinary} = require("../utils/imageUploader");
const CourseProgress = require("../models/CourseProgress")
const { convertSecondsToDuration } = require("../utils/secToDuration")

//create course handler
exports.createCourse = async (req,res) => {
    try{
        //data fetch
        const userId = req.user.id;
        let {courseName,courseDescription,whatYouWillLearn,instructions,price,category,
            tags,
            status} = req.body;

        //we received obj id of category only
        //fetch file / thumbnail
        const thumbnail = req.files.thumbnailImage;
        
        //validation
        if(!courseName || !courseDescription || !whatYouWillLearn || !price || !category 
            || !tags || !thumbnail
        ){
            return res.status(400).json({
                success:false,
                message:"All fields are required",
            });
        }
        if (!status || status === undefined) {
			status = "Draft";
		}

        //check if user is instructor or not
        const instructorDetails = await User.findById(userId);
        if (!instructorDetails) {
            console.log("No user found in DB for this ID:", userId);
        } 
        else {
            console.log("User found:", instructorDetails);
            console.log("accountType from DB:", instructorDetails.accountType);
            if (instructorDetails.accountType !== "Instructor") {
                console.log("Account type mismatch!");
        }
        }

        console.log("Instructor details:",instructorDetails);

        //tag validn
        if(!instructorDetails){
            return res.status(400).json({
                success:false,
                message:"Instructor details not found"
            })
        }

        //check category is valid or not
        const categoryDetails = await Category.findById(category);
        if(!categoryDetails) {
            return res.status(400).json({
                success:false,
                message:"Category details not found"
            })
        }

        //upload image to cloudinary - response is url
       const thumbnailImage = await uploadImageToCloudinary(thumbnail,process.env.FOLDER_NAME);

        //create course entry in db
        const newCourse = await Course.create({
            courseName,courseDescription,
            Instructor : instructorDetails._id, //this has obj id
            whatYouWillLearn,
            price,
            category:categoryDetails._id, //or only tag as we are getting obj id from req
            tags:JSON.parse(tags),
            instructions,status: status,
            thumbnail: thumbnailImage.secure_url,

        })

        //add course entry in user schema of instructor
        await User.findByIdAndUpdate(
            {_id:instructorDetails._id},
            {
                $push: {
                    courses:newCourse._id,
                }
            },
            {new:true}
        )

        //add course in catgory schema
        await Category.findByIdAndUpdate(
            {_id:categoryDetails._id},
            {
                $push: {
                    course: newCourse._id,
                }
            }
        )

        //return res
        return res.status(200).json({
            success:true,
            message:"Course created successfully",
            data:newCourse
        })

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Failed to create course",
            error:error.message
        })
    }
}

// edit course details
exports.editCourse = async (req, res) => {
  try {
    const { courseId } = req.body
    const updates = req.body
    const course = await Course.findById(courseId)

    if (!course) {
      return res.status(404).json({ error: "Course not found" })
    }

    // If Thumbnail Image is found, update it
    if (req.files) {
      console.log("thumbnail update")
      const thumbnail = req.files.thumbnailImage
      const thumbnailImage = await uploadImageToCloudinary(
        thumbnail,
        process.env.FOLDER_NAME
      )
      course.thumbnail = thumbnailImage.secure_url
    }

    // Update only the fields that are present in the request body
  Object.keys(updates).forEach((key) => {
    if (key === "tags" || key === "instructions") {
      course[key] = JSON.parse(updates[key])
    } 
    else {
      course[key] = updates[key]
    }
})

    await course.save()

    const updatedCourse = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "Instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "SubSection",
        },
      })
      .exec()

    res.json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}

//getAllCourses handler
exports.showAllCourses = async(req,res) => {
    try{
        const allCourses = await Course.find({
            status: "Published"
        },{
            courseName:true,
            price:true,
            thumbnail:true,
            instructor:true,
            ratingAndReviews:true,
            studentsEnrolled:true,
        }).populate("instructor")
		.exec();
        return res.status(200).json({
            success:true,
            message:"Data for all courses fetched successfully",
            data:allCourses
        })

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Cannot fetch course data",
            error:error.message,
        })
    }
}

//getCourseDetails
exports.getCourseDetails = async(req,res) => {
    try{
        //get id
        const {courseId} = req.body;
        //get course details
        const courseDetails = await Course.find(
            {_id:courseId})
            .populate(
                {
                    path:"Instructor",
                    populate:{
                        path:"additionalDetails",
                    }
                }
            )
            .populate("category")
            .populate("ratingAndReviews")
            .populate({
                path:"courseContent",
                populate:{
                    path:"SubSection"
                }
            })
            .exec();
        //validation
        if(!courseDetails){
            return res.status(400).json({
                success:false,
                message:`Could not find course with ${courseId}`,
            })
        }

        //return response
        return res.status(200).json({
            success:true,
            message:"Course details fetched successfully",
            data:courseDetails
         })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}


exports.getFullCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body
    const userId = req.user.id
    const courseDetails = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "Instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "SubSection",
        },
      })
      .exec()

    let courseProgressCount = await CourseProgress.findOne({
      courseID: courseId,
      userId: userId,
    })

    console.log("courseProgressCount : ", courseProgressCount)

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find course with id: ${courseId}`,
      })
    }

    // if (courseDetails.status === "Draft") {
    //   return res.status(403).json({
    //     success: false,
    //     message: `Accessing a draft course is forbidden`,
    //   });
    // }

    let totalDurationInSeconds = 0
    courseDetails.courseContent.forEach((content) => {
      content.SubSection.forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeDuration)
        totalDurationInSeconds += timeDurationInSeconds
      })
    })

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration,
        completedVideos: courseProgressCount?.completedVideos
          ? courseProgressCount?.completedVideos
          : [],
      },
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// Get a list of Course for a given Instructor
exports.getInstructorCourses = async (req, res) => {
  try {
    // Get the instructor ID from the authenticated user or request body
    const instructorId = req.user.id

    // Find all courses belonging to the instructor
    const instructorCourses = await Course.find({
      Instructor: instructorId,
    }).sort({ createdAt: -1 })
    .populate({
      path: "courseContent",
      populate: 
        { path: "SubSection" },
      })
      .exec()

    //attaching duration of each course:
    const coursesWithDuration = instructorCourses.map( (course) => {
      let totalDurationInSeconds = 0
      course.courseContent.forEach(content => {
        content.SubSection.forEach(subSection => {
          const timeDurationInSeconds = parseInt(subSection.timeDuration || 0)
          totalDurationInSeconds += timeDurationInSeconds
        })
      })
      return {
        ...course.toObject(),
        totalDuration: convertSecondsToDuration(totalDurationInSeconds)
      }
    })

    // Return the instructor's courses
    res.status(200).json({
      success: true,
      data:coursesWithDuration
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Failed to retrieve instructor courses",
      error: error.message,
    })
  }
}
// Delete the Course
exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.body

    // Find the course
    const course = await Course.findById(courseId)
    if (!course) {
      return res.status(404).json({ message: "Course not found" })
    }

    // Unenroll students from the course
    const studentsEnrolled = course.studentsEnrolled
    for (const studentId of studentsEnrolled) {
      await User.findByIdAndUpdate(studentId, {
        $pull: { courses: courseId },
      })
    }

    // Delete sections and sub-sections
    const courseSections = course.courseContent
    for (const sectionId of courseSections) {
      // Delete sub-sections of the section
      const section = await Section.findById(sectionId)
      if (section) {
        const subSections = section.SubSection
        for (const subSectionId of subSections) {
          await SubSection.findByIdAndDelete(subSectionId)
        }
      }
      // Delete the section
      await Section.findByIdAndDelete(sectionId)
    }

    // Delete the course
    await Course.findByIdAndDelete(courseId)

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}
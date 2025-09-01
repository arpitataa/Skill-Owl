const Course = require("../models/Course");
const Category = require("../models/Category");
const User = require("../models/User");
const Section = require("../models/Section");
const {uploadImageToCloudinary} = require("../utils/imageUploader");

//create course handler
exports.createCourse = async (req,res) => {
    try{
        //data fetch
        const userId = req.user.id;
        let {courseName,courseDescription,whatYouWillLearn,instructions,price,category,
            //tags,
            status} = req.body;

        //we received obj id of category only
        //fetch file / thumbnail
        //const thumbnail = req.files.thumbnailImage;
        
        //validation
        if(!courseName || !courseDescription || !whatYouWillLearn || !price || !category 
            // || !tags
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
       // const thumbnailImage = await uploadImageToCloudinary(thumbnail,process.env.FOLDER_NAME);

        //create course entry in db
        const newCourse = await Course.create({
            courseName,courseDescription,
            Instructor : instructorDetails._id, //this has obj id
            whatYouWillLearn,
            price,
            category:categoryDetails._id, //or only tag as we are getting obj id from req
           // tags,
            instructions,status: status,
            //thumbnail: thumbnailImage.secure_url,

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
                    courses: newCourse._id,
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


//getAllCourses handler
exports.showAllCourses = async(req,res) => {
    try{
        const allCourses = await Course.find({},{
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
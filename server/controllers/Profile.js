const Profile = require("../models/Profile");
const User = require("../models/User");
const Course = require("../models/Course");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

exports.updateProfile = async(req,res) => {
    try{
        //data fetch
        const {dateOfBirth="",about="",contactNumber,gender} = req.body;
        //get userId from req(passed from login middleware)
        const id = req.user.id;
        //validate
        if(!contactNumber || !id){
            return res.status(400).json({
                success:false,
                message:"Fill required fields"
            })
        }
        //find profile for user
        const userDetails = await User.findById(id);
        const profileId = userDetails.additionalDetails;
        const profileDetails = await Profile.findById(profileId);
        //update in db
        // -> modify the already created object 
        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.about = about;
        profileDetails.gender = gender;
        profileDetails.contactNumber = contactNumber;
        //save in db
        await profileDetails.save();
        //return response
        return res.status(200).json({
            success:true,
            message:"Profile updated successfully",
            profileDetails
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Profile cannot be updated",
            error:error.message,
        })
    }
}
//delete account

exports.deleteAccount = async(req,res) => {
    try{
        //get user id
        const userId = req.user.id;
        //validation
        const userDetails = await User.findById(userId).populate("courses");
        if(!userDetails){
            return res.status(404).json({
                success:false,
                message:"User not found"
            })
        }
        
        //unenrolled user from all enrolled courses
        const userCourses = userDetails.courses;

        for(const course of userCourses) {
            await Course.findByIdAndUpdate(course._id,{
                $pull:{studentsEnrolled : userId}
            })
        }
        

        //delete user. we need to delete the user 5 days after req
        //to do that 1. we add pending deletion and deletionTime in profile schema as false and null
        //update in profile, the values of pending deletion and deletiontime
        await Profile.findByIdAndUpdate(userDetails.additionalDetails,
            {
                pendingDeletion:true,
                /*deletionTime: new Date(Date.now() + 1 * 60 * 1000)  1 minute later */

                deletionTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
            });
        //return res
        return res.status(200).json({
            success:true,
            message:"Account deleted successfully",
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Profile cannot be deleted",
            error:error.message,
        })
    }
}

exports.getAllUserDetails = async(req,res) =>{
    try{
        //get id
        const id = req.user.id;
        //validation and get user details
        const userDetails = await User.findById(id).populate("additionalDetails").exec();
        //return res
        return res.status(200).json({
            success:true,
            message:"User data fetched successfully",
            userDetails
        })
    }
    catch(error){
        console.log(error.message)
        return res.status(500).json({
            success:false,
            message:"Failed to fetch data. Try again",
        })
    }
}
exports.updateDisplayPicture = async (req, res) => {
    try {
      const displayPicture = req.files.displayPicture
      const userId = req.user.id
      const image = await uploadImageToCloudinary(
        displayPicture,
        process.env.FOLDER_NAME,
        1000,
        1000
      )
      console.log(image)
      const updatedProfile = await User.findByIdAndUpdate(
        { _id: userId },
        { image: image.secure_url },
        { new: true }
      )
      res.send({
        success: true,
        message: `Image Updated successfully`,
        data: updatedProfile,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
};
exports.getEnrolledCourses = async (req, res) => {
    try {
      const userId = req.user.id
      const userDetails = await User.findOne({
        _id: userId,
      })
        .populate("courses")
        .exec()
      if (!userDetails) {
        return res.status(400).json({
          success: false,
          message: `Could not find user with id: ${userDetails}`,
        })
      }
      return res.status(200).json({
        success: true,
        data: userDetails.courses,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
};
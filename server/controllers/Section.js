const Section = require("../models/Section");
const Course = require("../models/Course");

exports.createSection = async(req,res) => {
    try{
        //data fetch
        const {sectionName,courseId} = req.body;
        //data validation
        if(!sectionName || !courseId){
            return res.status(400).json({
                success:false,
                message:"Missing properties"
            })
        }
        //create section
        const newSection = await Section.create({sectionName})
        //update course schema w section Object id
        const updatedCourseDetails = await Course.findByIdAndUpdate(
            courseId,
            {
                $push:{
                    courseContent:newSection._id,
                }
            },
            {new:true}
        ).populate({
            path: "courseContent",  // populate sections
            populate: {
                path: "SubSection", // populate subsections inside each section
            }
        })
        //return res
        return res.status(200).json({
            success:true,
            message:"Section created successfully",
            updatedCourseDetails,
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Unable to create sections.",
            error:error.message
        })
    }
}

exports.updateSection = async(req,res) => {
    try{
        //data input
        const{sectionName,sectionId} = req.body;
        //data validation
        if(!sectionName || !sectionId){
            return res.status(400).json({
                success:false,
                message:"Missing properties"
            })
        }
        //update data
        const section = await Section.findByIdAndUpdate(
            sectionId,
            {sectionName},
            {new:true}
        )

        return res.status(200).json({
            success:true,
            message:"Section updated successfully",
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Unable to create sections.",
            error:error.message
        })
    }
}

exports.deleteSection = async(req,res) => {
    try{
        //get id 
        const {sectionId,courseId} = req.body;
        //find id and delete
        await Section.findByIdAndDelete(sectionId);
        //update course - pull section from course
        await Course.findOneAndUpdate(
                        { courseContent: sectionId },
                        {
                          $pull: {
                            courseContent: sectionId,
                          },
                        }, {new:true}
                      )
        //return res
        return res.status(200).json({
            success:true,
            message:"Section deleted successfully",
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Unable to delete sections.",
            error:error.message
        })
    }
}
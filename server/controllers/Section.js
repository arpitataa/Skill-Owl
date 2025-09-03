const Section = require("../models/Section");
const Course = require("../models/Course");
const SubSection = require("../models/SubSection");

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

//update a section 
exports.updateSection = async(req,res) => {
    try{
        //data input
        const{sectionName,sectionId , courseId } = req.body;
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

        const course = await Course.findById(courseId)
        .populate({
            path:"courseContent",
            populate:{
                path:"SubSection",
            },
        })
        .exec();

        return res.status(200).json({
            success:true,
            message:section,
            data:course
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

        //pull section id from course
        await Course.findByIdAndUpdate(courseId,{
            $pull : {
                courseContent: sectionId,
            }
        })

        //check if section id is valid
        const section = await Section.findById(sectionId);
        console.log(sectionId,courseId);
        if(!section) {
            return res.status(404).json({
                success:false,
                message:"Section not found"
            })
        }
        //delete sub section
        await SubSection.deleteMany({_id: {$in : Section.subSection}})

        //delete section

        await Section.findByIdAndDelete(sectionId);
        
        //find updated course and return
        const course = await Course.findById(courseId).populate({
             path:"courseContent",
             populate : {
                path: "SubSection"
             }
        })
        .exec();
        //return res
        return res.status(200).json({
            success:true,
            data:course,
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
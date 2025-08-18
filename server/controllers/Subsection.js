const SubSection  = require("../models/SubSection");
const Section = require("../models/Section");
const {uploadImageToCloudinary} = require("../utils/imageUploader")

//create subsection
exports.createSubSection = async(req,res) =>{
    try{
        //data fetch frm req body
        const {sectionId, title,timeDuration,description} = req.body;
        //extract file/video
        const video = req.files.videoFile;
        //validation
        if(!sectionId || !title || !timeDuration || !description || !video){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }
        //upload video to cloudinary and we get the secureurl
        const uploadDetails = await uploadImageToCloudinary(video,process.env.FOLDER_NAME);

        //create subsection
        const subSectionDetails = await SubSection.create({
            title,
            timeDuration,
            description,
            videoUrl: uploadDetails.secure_url
        })
        //update section w subsection obj id
        const updatedSection = await Section.findByIdAndUpdate(
            {_id:sectionId},
            {$push:{
                SubSection:subSectionDetails._id
            }},
            {new:true}
        ).populate()
        //return response
        return res.status(200).json({
            success:true,
            message:"Sub Section created successfully",
            updatedSection
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Could not create subsection",
            error:error.message
        })
    }
}

//update subsection
exports.updateSubSection = async(req,res) => {
    try{
        //data fetch
        const {subSectionId, title,description} = req.body;
        const subSection = await SubSection.findById(subSectionId)

        if (!subSection) {
        return res.status(404).json({
          success: false,
          message: "SubSection not found",
        })
      }
  
      if (title !== undefined) {
        subSection.title = title
      }
      if (description !== undefined) {
        subSection.description = description
    }
    if (req.files && req.files.video !== undefined) {
        const video = req.files.video
        const uploadDetails = await uploadImageToCloudinary(
                video, process.env.FOLDER_NAME)
        subSection.videoUrl = uploadDetails.secure_url
        subSection.timeDuration = `${uploadDetails.duration}`
    }
    await subSection.save()
        //return res
        return res.status(200).json({
            success:true,
            message:"subsection updated successfully"
        })
    }
    catch(error)
    {
        return res.status(500).json({
        success:false,
        message:"Could not update subsection",
        error:error.message
        })
    }
}

//delete subsection
exports.deleteSubSection = async(req,res) => {
    try{
        //fetch data
        const {subSectionId,sectionId} = req.body;
        await Section.findByIdAndUpdate(
                { _id: sectionId },
                {
                  $pull: {
                    subSection: subSectionId,
                  },
                }
              )
        //find by id and delete
      const subSection = await SubSection.findByIdAndDelete({ _id: subSectionId })
      if (!subSection) {
        return res
          .status(404)
          .json({ success: false, message: "SubSection not found" })
      }
        //return response
        return res.status(200).json({
            success:true,
            message:"subsection deleted successfully"
        })
    }
    catch(error)
    {
        return res.status(500).json({
        success:false,
        message:"Could not delete subsection",
        error:error.message
        })
    }
}
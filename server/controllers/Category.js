const Category = require("../models/Category");
const Course = require("../models/Course");
//create Tag handler function

exports.createCategory = async(req,res) => {
    try{
        //fetch data
        const {name,description} = req.body;
        //validation
        if(!name || !description) {
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }
        //create entry in db
        const categoryDetails = await Category.create({
            name,
            description
        });
        console.log(categoryDetails);
        return res.status(200).json({
            success:true,
            message:"Category created successfully"
        })
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message:error.message
        })
    }
}

//getAllTags handler
exports.showAllCategories = async(req,res) => {
    try{
        const allCategory = await Category.find({},{name:true,description:true})
        .populate({
            path:"course",
            match: { status: "Published" }    
        }).exec();
        return res.status(200).json({
            success:true,
            message:"All categories returned successfully",
            allCategory
        })
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message:error.message
        })
    }
}

//category Page details
exports.categoryPageDetails = async(req,res) => {
    try{
        //get category id
        const {categoryId} = req.body;
        //get all courses for the corresponding category id
        const selectedCategory = await Category.findById(categoryId)
                                    .populate("course")
                                    .exec();
        //validation
        if(!selectedCategory){
            return res.status(404).json({
                success:false,
                message:"Data not found"
            });
        }
        //get courses for different categories for suggestion
        const differentCategories = await Category.find({
                                        _id: {$ne:categoryId},
                                        })
                                        .populate("course")
                                        .exec();
        //get courses for top 10 selling 
        const topCourses = await Course.aggregate([
            {
                $addFields : {
                    enrolledCount : {$size : "$studentsEnrolled"}
                }
            },
            {
                $sort: {enrolledCount: -1}
            },
            {
                $limit:10
            }
            
        ])
        //return response
        return res.status(200).json({
            success:true,
            data:{
                selectedCategory,
                differentCategories,
                topCourses
            }
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({

        })
    }
}
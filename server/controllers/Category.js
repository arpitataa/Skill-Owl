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
                                    .populate({
                                        path:"course",
                                        match: { status: "Published" },
                                        populate: "ratingAndReviews"
                                    })
                                    .exec();
        //validation
        if(!selectedCategory){
            return res.status(404).json({
                success:false,
                message:"Data not found"
            });
        }

        //handle case when there are no courses for selected category
        if (selectedCategory.course.length === 0) {
            console.log("No courses found for the selected category.")
            return res.status(404).json({
                success: false,
                message: "No courses found for the selected category.",
            })
        }


        //get courses for different categories for suggestion
        const differentCategory = await Category.find({
                                        _id: {$ne:categoryId},
                                        })
                                        .populate({
                                            path:"course",
                                            match: { status: "Published" },
                                        })
                                        .exec();
                                        
        //get courses for top selling across all categories 

        const allCategories = await Category.find()
                                    .populate({
                                        path: "course",
                                        match: { status: "Published" },
                                        populate: {
                                            path: "Instructor",
                                        },
                                    })
                                    .exec()
        const allCourses = allCategories.flatMap((category) => category.course)
        const mostSellingCourses = allCourses
                                    .sort((a, b) => b.sold - a.sold)
                                    .slice(0, 10)
       // console.log("mostSellingCourses COURSE", mostSellingCourses)
        //return response
        return res.status(200).json({
            success:true,
            data: {
                selectedCategory,
                differentCategory,
                mostSellingCourses,
        },
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({

        })
    }
}
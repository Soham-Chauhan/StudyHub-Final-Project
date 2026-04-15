const Category = require('../models/Category');
const Course = require('../models/Course')
function getRandomInt(max) {
    return Math.floor(Math.random() * max)
  }
exports.createCategory = async (req,res) =>{
    try {
        const {name, description} =  req.body;

        if(!name || !description){
            return res.status(401).json({
                success:false,
                message:"Tag name or description not available"
            })
        }

        const newCategory = await Category.create({
            name,
            description
        })

        if (!newCategory) {
            return res.status(401).json({
                success:false,
                message:"Error in pushing new tag to db"
            }) 
        }

        return res.status(200).json({
            success:true,
            message:"Tag created successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

exports.showAllCategories = async (req,res) => {

    try {
        const allCategories =  await Category.find({},{name:true,
                                        description:true});
        
            return res.status(200).json({
                success:true,
                message:"All tags received",
                data:allCategories
            })  
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

exports.categoryPageDetails = async (req, res) => {
  try {
    const { categoryId } = req.body;
    console.log("PRINTING CATEGORY ID: ", categoryId);

    // Selected category with published courses
    const selectedCourses = await Category.findById(categoryId)
      .populate({
        path: "course",
        match: { status: "Published" },
        populate: "ratingAndReviews",
      })
      .exec();

    if (!selectedCourses) {
      console.log("Category not found.");
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    if (!selectedCourses.course || selectedCourses.course.length === 0) {
      console.log("No courses found for the selected category.");
      return res.status(404).json({
        success: false,
        message: "No courses found for the selected category.",
      });
    }

    // Other categories that have at least one course
    const categoriesExceptSelected = await Category.find({
      _id: { $ne: categoryId },
      course: { $exists: true, $ne: [] },
    });

    console.log("categoriesExceptSelected", categoriesExceptSelected);

    let differentCourses = null;

    if (categoriesExceptSelected.length > 0) {
      const randomCategory =
        categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)];

      differentCourses = await Category.findById(randomCategory._id)
        .populate({
          path: "course",
          match: { status: "Published" },
          populate: "ratingAndReviews",
        })
        .exec();
    }

    // Top-selling / published courses
    const mostSellingCourses = await Course.find({ status: "Published" })
      .populate("ratingAndReviews")
      .exec();

    return res.status(200).json({
      success: true,
      selectedCourses,
      differentCourses,
      mostSellingCourses,
      name: selectedCourses.name,
      description: selectedCourses.description,
    });
  } catch (error) {
    console.log("CATEGORY PAGE DETAILS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
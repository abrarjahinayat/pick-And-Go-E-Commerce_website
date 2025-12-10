const slugify = require("slugify");
const subcategoryModel = require("../model/subcategory.model");
const categoryModel = require("../model/category.model");
const addsubCategoryControllers = async (req, res) => {
  try {
    let { name, category } = req.body;

    let slug = slugify(name, {
      replacement: "-",
      remove: undefined,
      lower: true,
      trim: true,
    });

    let addsubcategory = new subcategoryModel({
      name,
      slug,
        category,
    });

    let updatecategory = await categoryModel.findOneAndUpdate(
      { _id: category },
      { $push: { subcategory: addsubcategory._id } }
    );
    await updatecategory.save();

    await addsubcategory.save();

    return res.status(201).json({
      success: true,
      message: "SubCategory added successfully",
      data: addsubcategory,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message || error,
    });
  }
};

const deletesubCategoryControllers = async (req, res) => {
  try {

    let { id } = req.params;

    let deletedSubCategory = await subcategoryModel.findByIdAndDelete({ _id: id });

    let updatecategory = await categoryModel.findOneAndUpdate(
      {subcategory: id },
      { $pull: { subcategory: id} }
    );
    // await updatecategory.save();

    if (!deletedSubCategory) {
      return res
        .status(404)
        .json({ success: false, message: "SubCategory id not found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "SubCategory deleted successfully" });
    
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message || error,
    });
  }
}

const subCategoryControllers = async (req, res) => {
  try {
    let { id } = req.params;
    let{name}=req.body;

    let slug = slugify(name, {
      replacement: "-",
      remove: undefined,
      lower: true,
      trim: true,
    });

    let updatesubcategory = await subcategoryModel.findOneAndUpdate(
      { _id: id },
      { name, slug },
      { new: true }
    );
    if (!updatesubcategory) {
      return res
        .status(404)
        .json({ success: false, message: "SubCategory id not found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "SubCategory updated successfully" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message || error,
    });
  }
}

module.exports = { addsubCategoryControllers, deletesubCategoryControllers, subCategoryControllers };

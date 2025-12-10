const categoryModel = require("../model/category.model");
const slugify = require("slugify");
const fs = require("fs");
const path = require("path");

// Add Category Controller
const addcategoryControllers = async (req, res) => {
  try {
    let { filename } = req.file;
    let { name } = req.body;

    let slug = slugify(name, {
      replacement: "-",
      remove: undefined,
      lower: true,
      trim: true,
    });

    let addcategory = await new categoryModel({
      image: `${process.env.SERVER_URL}/${filename}`,
      name,
      slug,
    });
    await addcategory.save();
    return res.status(201).json({
      success: true,
      message: "Category added successfully",
      data: addcategory,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message || error,
    });
  }
};

// Delete Category Controller
const deletecategoryControllers = async (req, res) => {
  try {
    let { id } = req.params;
    let categorypath = path.join(__dirname, `../../uploads/`);
    let deletedCategory = await categoryModel.findByIdAndDelete({ _id: id });
    let imageurl = deletedCategory.image.split("/");
    fs.unlink(`${categorypath}/${imageurl[imageurl.length - 1]}`, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
      } else {
        console.log("File deleted successfully");
      }
    });
    if (!deletedCategory) {
      return res
        .status(404)
        .json({ success: false, message: "Category id not found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message || error,
    });
  }
};


// Update Category Controller
const updatecategoryControllers = async (req, res) => {
  try {
    let { id } = req.params;
    let { filename } = req.file;
    let { name } = req.body;

    let slug = slugify(name, {
      replacement: "-",
      remove: undefined,
      lower: true,
      trim: true,
    });

    if (!name || !filename) {
      return res.status(404).json({
        success: false,
        message: "Please provide name or image to update",
      });
    } else {
      let findcategory = await categoryModel.findOne({ _id: id });
      if (findcategory) {
        // old image path delete
        let imageurl = findcategory.image.split("/");
        let filepath = path.join(__dirname, "../../uploads");
        fs.unlink(`${filepath}/${imageurl[imageurl.length - 1]}`, (err) => {
          if (err) {
            console.log(err);
          }
        });
        // updated image into database
        (findcategory.image = `${process.env.SERVER_URL}/${filename}`),
          (findcategory.name = name),
          (findcategory.slug = slug),
          await findcategory.save();
        return res.status(200).json({
          success: true,
          message: "Category updated successfully",
          data: findcategory,
        });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "Category not found" });
      }
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message || error,
    });
  }
};

// Get All Category Controller
const getallcategoryControllers = async (req, res) => {
  try {
    let allcategory = await categoryModel.find({}).populate({
      path: "subcategory",
      select : "name slug",
    });
    return res.status(200).json({
      success: true,
      message: "All Category fetched successfully",
      data: allcategory,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message || error,
    });
  }
};


module.exports = {
  addcategoryControllers,
  deletecategoryControllers,
  getallcategoryControllers,
  updatecategoryControllers,
};

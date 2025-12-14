const slugify = require("slugify");
const productModel = require("../model/product.model");
const fs = require("fs");
const path = require("path");
const categoryModel = require("../model/category.model");
const addproductControllers = async (req, res) => {
 try {
    let { title, price, description, category, stock, productType, reviews, rating, variantType, variants , originalPrice, isNew } = req.body;
    let image = req.files;

    const imagePaths = req.files.map((item)=> {
      return `${process.env.SERVER_URL}/${item.filename}` ;
    })


    let slug = slugify(title, { 
      replacement: "-",
      remove: undefined,
      lower: true,
      trim: true,
    });
    if (!title || !productType  || !description || !category || !image || !stock || !variantType) {
      return res.status(400).json({ message: "All fields are required" });
    } else {
      let addproduct = await new productModel({
        title,
        price,
        description,
        category,
        image : imagePaths,
        slug,
        stock,
        productType,
        reviews,
        rating,
        variantType,
        variants,
        originalPrice,
        isNew
      });
      await addproduct.save();
      return res.status(201).json({
        success: true,
        message: "Product added successfully",
        data: addproduct,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message || error,
    });
  }
};

const getallproductControllers = async (req, res) => {
  try {
    let products = await productModel.find({}).populate({path: 'variants', select: 'size color stock _id'});
    return res.status(200).json({
      success: true,
      message: "All Product fetched successfully",
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message || error,
    });
  }
};

const getleastproductControllers = async (req, res) => {
  try {
    let products = await productModel.find({isNew: true}).populate({path: 'variants', select: 'size color stock _id'})
    return res.status(200).json({
      success: true,
      message: "All Product fetched successfully",
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message || error,
    });
  }
}


const deleteproductControllers = async (req, res) => {
  try {

    let { id } = req.params;

    let findproduct = await productModel.findById(id);

     findproduct.image.forEach((imgPath)=>{
      const filename = imgPath.split('/').pop();
      const filepath = path.join(__dirname, "../../uploads", filename);
      fs.unlink(filepath, (err) => {
        if (err) {
          console.error("Error deleting file:", err);
        } else {
          console.log("File deleted successfully");
        }
      });
     }) 

    await productModel.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
    
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message || error,
    });
  }
}

const getproductbyslugControllers = async (req, res) => {
  try {
      let { slug } = req.params;
       let products = await productModel.findOne({slug}).populate({path: 'variants', select: 'size color stock _id'}).sort({ createdAt:-1 }).limit(5);
    return res.status(200).json({
      success: true,
      message: "All Product fetched successfully",
      data: products,
    });
    
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message || error,
    });
  }
}

const getmenproductsControllers = async (req, res) => {
  try {
      let products = await productModel.find({productType: "men"}).populate({path: 'variants', select: 'size color stock _id'});
    return res.status(200).json({
      success: true,
      message: "All Product fetched successfully",
      data: products,
    });
    
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message || error,
    });
  }
};

const getwomenproductsControllers = async (req, res) => {
  try {
      let products = await productModel.find({productType: "women"}).populate({path: 'variants', select: 'size color stock _id'});
    return res.status(200).json({
      success: true,
      message: "All Product fetched successfully",
      data: products,
    });
    
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message || error,
    });
  }
};

const getkidsproductsControllers = async (req, res) => {
  try {
      let products = await productModel.find({productType: "kids"}).populate({path: 'variants', select: 'size color stock _id'});
    return res.status(200).json({
      success: true,
      message: "All Product fetched successfully",
      data: products,
    });
    
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message || error,
    });
  }
};

const getProductsByCategory = async (req, res) => {
  try {
    const { slug } = req.params;

    const category = await categoryModel.findOne({ slug });
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    const products = await productModel.find({ category: category._id });

    res.status(200).json({
      success: true,
      category,
      products,
    });

  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};



module.exports = { addproductControllers, getallproductControllers, getleastproductControllers, deleteproductControllers ,getproductbyslugControllers , getmenproductsControllers , getwomenproductsControllers , getkidsproductsControllers ,getProductsByCategory}; 

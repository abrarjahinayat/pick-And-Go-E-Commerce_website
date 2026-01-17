const slugify = require("slugify");
const productModel = require("../model/product.model");
const fs = require("fs");
const path = require("path");
const categoryModel = require("../model/category.model");
const subcategoryModel = require("../model/subcategory.model");
const addproductControllers = async (req, res) => {
  try {
    let {
      title,
      price,
      description,
      category,
      subcategory,
      stock,
      productType,
      reviews,
      rating,
      variantType,
      variants,
      originalPrice,
      isNew,
      isFeatured,
    } = req.body;
    let image = req.files;

    const imagePaths = req.files.map((item) => {
      return `${process.env.SERVER_URL}/${item.filename}`;
    });

    let slug = slugify(title, {
      replacement: "-",
      remove: undefined,
      lower: true,
      trim: true,
    });
    if (
      !title ||
      !productType ||
      !description ||
      !category ||
      !image ||
      !stock ||
      !variantType
    ) {
      return res.status(400).json({ message: "All fields are required" });
    } else {
      let addproduct = await new productModel({
        title,
        price,
        description,
        category,
        subcategory,
        image: imagePaths,
        slug,
        stock,
        productType,
        reviews,
        rating,
        variantType,
        variants,
        originalPrice,
        isNew,
        isFeatured,
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
    let products = await productModel
      .find({})
      .populate({ path: "variants", select: "size color stock _id" });
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
    let products = await productModel
      .find({ isNew: true })
      .populate({ path: "variants", select: "size color stock _id" });
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

const deleteproductControllers = async (req, res) => {
  try {
    let { id } = req.params;

    let findproduct = await productModel.findById(id);

    findproduct.image.forEach((imgPath) => {
      const filename = imgPath.split("/").pop();
      const filepath = path.join(__dirname, "../../uploads", filename);
      fs.unlink(filepath, (err) => {
        if (err) {
          console.error("Error deleting file:", err);
        } else {
          console.log("File deleted successfully");
        }
      });
    });

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
};

const getproductbyslugControllers = async (req, res) => {
  try {
    let { slug } = req.params;
    let products = await productModel
      .findOne({ slug })
      .populate({ path: "variants", select: "size color stock _id" })
      .sort({ createdAt: -1 })
      .limit(5);
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

const getmenproductsControllers = async (req, res) => {
  try {
    let products = await productModel
      .find({ productType: "men" })
      .populate({ path: "variants", select: "size color stock _id" });
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
    let products = await productModel
      .find({ productType: "women" })
      .populate({ path: "variants", select: "size color stock _id" });
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

const accessoriesproductsControllers = async (req, res) => {
  try {
    let products = await productModel
      .find({ productType: "accessories" })
      .populate({ path: "variants", select: "size color stock _id" });
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
const featuredproductsControllers = async (req, res) => {
  try {
    let products = await productModel
      .find({ isFeatured: true })
      .populate({ path: "variants", select: "size color stock _id" })
      .limit(8);
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
    let products = await productModel
      .find({ productType: "kids" })
      .populate({ path: "variants", select: "size color stock _id" });
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
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    const products = await productModel.find({ category: category._id });

    res.status(200).json({
      success: true,
      massage: "All category Product fetched successfully",
      data: products,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getProductsByCategoryAndSubCategory = async (req, res) => {
  try {
    const { categorySlug, subcategorySlug } = req.params;

    // 1. Find category
    const category = await categoryModel.findOne({ slug: categorySlug });
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // 2. Find subcategory under that category
    const subcategory = await subcategoryModel.findOne({
      slug: subcategorySlug,
      category: category._id,
    });

    if (!subcategory) {
      return res.status(404).json({
        success: false,
        message: "SubCategory not found in this category",
      });
    }

    // 3. Find products
    const products = await productModel
      .find({
        category: category._id,
        subcategory: subcategory._id,
      })
      .populate("category subcategory")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      category,
      subcategory,
      products,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getSimilarProductsControllers = async (req, res) => {
  try {
    const { slug } = req.params;

    // 1. Find current product
    const product = await productModel.findOne({ slug });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // 2. Find similar products
    const similarProducts = await productModel
      .find({
        _id: { $ne: product._id },              // exclude current product
        category: product.category,             // same category
        subcategory: product.subcategory,       // same subcategory
      })
      .populate("category subcategory")
      .limit(4);

    return res.status(200).json({
      success: true,
      message: "Similar products fetched successfully",
      data: similarProducts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message || error,
    });
  }
};

const getCategoryPoloControllers = async (req, res) => {
 try {
    const { slug } = req.params;

    // 1. find category by slug
    const category = await categoryModel.findOne({ slug });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // 2. find products by category _id
    const products = await productModel
      .find({ category: category._id })
      .populate("category subcategory").limit(5);

    return res.status(200).json({
      success: true,
      category: category.name,
      data: products,
    });
  } 
  catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message || error,
    })
  }
}

const getCategoryKurtiTopsControllers = async (req, res) => {
   try {
    const { slug } = req.params;

    // 1. find category by slug
    const category = await categoryModel.findOne({ slug });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // 2. find products by category _id
    const products = await productModel
      .find({ category: category._id })
      .populate("category subcategory").limit(5);

    return res.status(200).json({
      success: true,
      category: category.name,
      data: products,
    });
  } 
  catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message || error,
    })
  }
}

const getCategoryPanjabiControllers = async (req, res) => {
   try {
    const { slug } = req.params;

    // 1. find category by slug
    const category = await categoryModel.findOne({ slug });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // 2. find products by category _id
    const products = await productModel
      .find({ category: category._id })
      .populate("category subcategory").limit(5);

    return res.status(200).json({
      success: true,
      category: category.name,
      data: products,
    });
  } 
  catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message || error,
    })
  }
}

const getCategoryCargoDenimsControllers = async (req, res) => {
   try {
    const { slug } = req.params;

    // 1. find category by slug
    const category = await categoryModel.findOne({ slug });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // 2. find products by category _id
    const products = await productModel
      .find({ category: category._id })
      .populate("category subcategory").limit(5);

    return res.status(200).json({
      success: true,
      category: category.name,
      data: products,
    });
  } 
  catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message || error,
    })
  }
}

const getpremiumsockesControllers = async (req, res) => {
   try {
    const { slug } = req.params;

    // 1. find category by slug
    const category = await categoryModel.findOne({ slug });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // 2. find products by category _id
    const products = await productModel
      .find({ category: category._id })
      .populate("category subcategory").limit(5);

    return res.status(200).json({
      success: true,
      category: category.name,
      data: products,
    });
  } 
  catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message || error,
    })
  }
}

const getallmencategoryControllers = async (req, res) => {
  try {
    const categories = await productModel.aggregate([
      // 1️⃣ only men products
      {
        $match: { productType: "men" },
      },

      // 2️⃣ join category collection
      {
        $lookup: {
          from: "categories", // collection name (IMPORTANT)
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },

      // 3️⃣ unwind category array
      { $unwind: "$category" },

      // 4️⃣ group by category name (unique)
      {
        $group: {
          _id: "$category.name",
        },
      },

      // 5️⃣ rename field
      {
        $project: {
          _id: 0,
          name: "$_id",
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      message: "Unique men category names fetched successfully",
      data: categories.map((c) => c.name),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};







module.exports = {
  addproductControllers,
  getallproductControllers,
  getleastproductControllers,
  deleteproductControllers,
  getproductbyslugControllers,
  getmenproductsControllers,
  getwomenproductsControllers,
  getkidsproductsControllers,
  getProductsByCategory,
  featuredproductsControllers,
  getProductsByCategoryAndSubCategory,
  getSimilarProductsControllers,
  getCategoryPoloControllers,
  getCategoryKurtiTopsControllers,
  getCategoryPanjabiControllers ,
  getCategoryCargoDenimsControllers,
  accessoriesproductsControllers,
  getpremiumsockesControllers,
  getallmencategoryControllers,
};

const productsCollectionBanner = require("../model/products.collection.banner");

const addproductCollectionBanner = async (req, res) => {
  try {
    let { filename } = req.file;
    let { link, title, category, isActive } = req.body;
    let productCollectionBanner = await new productsCollectionBanner({
      image: `${process.env.SERVER_URL}/${filename}`,
      link: `${process.env.FEATURE_PRODUCT_URL}/${link}`,
      title,
      category,
      isActive,
    });
    await productCollectionBanner.save();
    return res
      .status(201)
      .json({
        success: true,
        message: "ProductCollectionBanner added successfully",
        data: productCollectionBanner,
      });
  } catch (error) {
    return res
      .status(500)
      .json({
        success: false,
        message: "Server Error",
        error: error.message || error,
      });
  }
};

const getdesignerpoloBanner = async (req, res)=>{
    try {
        let designerpoloBanner = await productsCollectionBanner.find({title: "Designer Polo"});
        return res.status(200).json({success: true, message: "Designer Polo Banner", data: designerpoloBanner});
        
    } catch (error) {
        return res.status(500).json({success: false, message: "Server Error", error: error.message || error});
    }
}

const getkurtitopsBanner = async (req, res)=>{
    try {
        let kurtitopsBanner = await productsCollectionBanner.find({title: "Kurti Tunic And Tops"});
        return res.status(200).json({success: true, message: "Kurti Tops Banner get successfully", data: kurtitopsBanner});
        
    } catch (error) {
        return res.status(500).json({success: false, message: "Server Error", error: error.message || error});
    }
}

module.exports = { addproductCollectionBanner , getdesignerpoloBanner , getkurtitopsBanner };

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

const getpanjabiBanner = async (req, res)=>{
    try {
        let panjabiBanner = await productsCollectionBanner.find({title: "Panjabi"});
        return res.status(200).json({success: true, message: "Panjabi Banner get successfully", data: panjabiBanner});
        
    } catch (error) {
        return res.status(500).json({success: false, message: "Server Error", error: error.message || error});
    }
}

const getcargodenimsBanner = async (req, res)=>{
    try {
        let cargodenimsBanner = await productsCollectionBanner.find({title: "Cargo Denims"});
        return res.status(200).json({success: true, message: "Cargo Denims Banner get successfully", data: cargodenimsBanner});
        
    } catch (error) {
        return res.status(500).json({success: false, message: "Server Error", error: error.message || error});
    }
}

const getlittleonesteesBanner = async (req, res)=>{
    try {
        let littleonesteesBanner = await productsCollectionBanner.find({title: "Little Ones Tees"});
        return res.status(200).json({success: true, message: "Little Ones Tees Banner get successfully", data: littleonesteesBanner});
        
    } catch (error) {
        return res.status(500).json({success: false, message: "Server Error", error: error.message || error});
    }
}

const getpremiumsockesBanner = async (req, res)=>{
    try {
        let premiumsockesBanner = await productsCollectionBanner.find({title: "Premium Sockes"});
        return res.status(200).json({success: true, message: "Premium Sockes Banner get successfully", data: premiumsockesBanner});
        
    } catch (error) {
        return res.status(500).json({success: false, message: "Server Error", error: error.message || error});
    }
}

const getwomenproductsBanner = async (req, res)=>{
    try {
        let womenproductsBanner = await productsCollectionBanner.find({title: "Women Products"});
        return res.status(200).json({success: true, message: "Women Products Banner get successfully", data: womenproductsBanner});
        
    } catch (error) {
        return res.status(500).json({success: false, message: "Server Error", error: error.message || error});
    }
}
module.exports = { addproductCollectionBanner , getdesignerpoloBanner , getkurtitopsBanner, getpanjabiBanner , getcargodenimsBanner , getlittleonesteesBanner , getpremiumsockesBanner , getwomenproductsBanner };

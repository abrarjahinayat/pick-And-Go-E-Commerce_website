
const fs = require("fs");
const path = require("path");
const featureimgModel = require("../model/featureimg.model");

// Add Banner Controller
const addfeatureimgControllers = async (req, res) => {
  let { link } = req.body;
  let { filename } = req.file;
  let {title} = req.body


  try {
    let featureimg = await new featureimgModel({
      image: `${process.env.SERVER_URL}/${filename}`,
      link: `${process.env.FEATURE_PRODUCT_URL}/${link}`,
      title
    });
    await featureimg.save();

    return res.status(201).json({
      success: true,
      message: "featureimg added successfully",
      data: featureimg,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message || error });
  }
};

const getallfeatureimgControllers = async (req, res) => {
    try {
        let allfeatureimg = await featureimgModel.find({}).limit(6);
        return res.status(200).json({success: true, message: "All featureimg", data: allfeatureimg});
        
    } catch (error) {
        return res.status(500).json({message: "Server Error", error: error.message || error});
    }
}

const getnextThreefeatureimgControllers = async (req, res) => {
    try {
        let allfeatureimg = await featureimgModel.find({}).skip(6).limit(3);
        return res.status(200).json({success: true, message: "All featureimg", data: allfeatureimg});
        
    } catch (error) {
        return res.status(500).json({message: "Server Error", error: error.message || error});
    }
}

const getnextsixfeatureimgControllers = async (req, res) => {
    try {
        let allfeatureimg = await featureimgModel.find({}).skip(9).limit(6);
        return res.status(200).json({success: true, message: "All featureimg", data: allfeatureimg});
        
    } catch (error) {
        return res.status(500).json({message: "Server Error", error: error.message || error});
    }
}

const getaccessoriesfeatureimgControllers = async (req, res) => {
      try {
        let allfeatureimg = await featureimgModel.find({}).skip(15).limit(3);
        return res.status(200).json({success: true, message: "All featureimg", data: allfeatureimg});
        
    } catch (error) {
        return res.status(500).json({message: "Server Error", error: error.message || error});
    }
}

const getkidsfeatureimgControllers = async (req, res) => {
     try {
        let allfeatureimg = await featureimgModel.find({}).skip(18).limit(3);
        return res.status(200).json({success: true, message: "All featureimg", data: allfeatureimg});
        
    } catch (error) {
        return res.status(500).json({message: "Server Error", error: error.message || error});
    }
}

module.exports = { addfeatureimgControllers , getallfeatureimgControllers , getnextThreefeatureimgControllers , getnextsixfeatureimgControllers , getaccessoriesfeatureimgControllers , getkidsfeatureimgControllers };
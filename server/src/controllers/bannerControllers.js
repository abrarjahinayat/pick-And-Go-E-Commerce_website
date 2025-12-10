const bannerModel = require("../model/banner.model");
const fs = require("fs");
const path = require("path");

// Add Banner Controller
const addbannerControllers = async (req, res) => {
  let { link } = req.body;
  let { filename } = req.file;

  console.log(filename);

  try {
    let banner = await new bannerModel({
      image: `${process.env.SERVER_URL}/${filename}`,
      link,
    });
    await banner.save();

    return res.status(201).json({
      success: true,
      message: "Banner added successfully",
      data: banner,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message || error });
  }
};

// Delete Banner Controller
const deletebannerControllers = async (req, res) => {
  try {
    let { id } = req.params;
    let deletedBanner = await bannerModel.findByIdAndDelete({ _id: id });
    let imageurl = deletedBanner.image.split("/");
    let filepath = path.join(__dirname, "../../uploads");
    fs.unlink(`${filepath}/${imageurl[imageurl.length - 1]}`, (err) => {
      if (err) {
        console.log(err);
      }
    });
    if (!deletedBanner) {
      return res
        .status(404)
        .json({ success: false, message: "Banner not found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Banner deleted successfully" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message || error,
    });
  }
};

// Update Banner Controller

const updatebannerControllers = async (req, res) => {
  try {
    let { id } = req.params;
    let { filename } = req.file;

    let findbanner = await bannerModel.findOne({ _id: id });
    if (findbanner) {
      // old image path delete
      let imageurl = findbanner.image.split("/");
      let filepath = path.join(__dirname, "../../uploads");
      fs.unlink(
        `${filepath}/${imageurl[imageurl.length - 1]}`,

        (err) => {
          if (err) {
            console.log(err);
          }
        }
      );
      // updated image into database
      (findbanner.image = `${process.env.SERVER_URL}/${filename}`),
        await findbanner.save();
      return res.status(200).json({
        success: true,
        message: "Banner updated successfully",
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Banner not found",
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

// Get All Banner Controller

const getallbannerControllers = async (req, res) => {
    try {
        let allbanner = await bannerModel.find({});
        return res.status(200).json({success: true, message: "All Banner", data: allbanner});
        
    } catch (error) {
        return res.status(500).json({message: "Server Error", error: error.message || error});
    }
}

module.exports = {
  addbannerControllers,
  deletebannerControllers,
  updatebannerControllers,
  getallbannerControllers
};

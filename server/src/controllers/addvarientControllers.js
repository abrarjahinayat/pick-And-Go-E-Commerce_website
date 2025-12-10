const productModel = require("../model/product.model");
const varientModel = require("../model/varient.model");

const addvarientControllers = async (req, res) => {
 

    try {

        let { product, size, stock , color } = req.body;

        if (!product || !stock) {
            return res.status(400).json({ message: "All fields are required" });
          } else {
            let addvarient = await new varientModel({
              product,
              size,
              stock,
              color
            });
            addvarient.save();

        await productModel.findOneAndUpdate(
                  { _id: product },
                  { $push: { variants: addvarient._id } }
                );
 
            return res.status(201).json({
              success: true,
              message: "Varient added successfully",
              data: addvarient,
            });
          }
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message || error,
          });
    }
    
}

module.exports = { addvarientControllers };
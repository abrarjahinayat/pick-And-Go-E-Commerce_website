const cartModel = require("../model/cart.model");
const productModel = require("../model/product.model");

const addtocartControllers = async (req, res) => {
  try {
    let { user, product, variants, quantity } = req.body;

    const productinfo = await productModel.findById(product);
    if (!productinfo) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Base filter always includes user + product
    const cartFilter = { user, product };

    // For multi-variant products, also include the selected variant
    if (productinfo.variantType === "MultiVarient") {
      if (!variants) {
        return res.status(400).json({
          success: false,
          message: "Please select variant for multi-variant product",
        });
      }
      cartFilter.variants = variants; // assuming this is a variantId or similar
    }

    // Now check if THIS exact combination already exists
    const cartinfo = await cartModel.findOne(cartFilter);

    if (cartinfo) {
      return res.status(400).json({
        success: false,
        message: "This product (with this variant) is already in your cart",
      });

      // OR instead of error, you could just update quantity:
      // cartinfo.quantity += quantity;
      // cartinfo.totalPrice += ...
      // await cartinfo.save();
      // and then return success
    }

    // Calculate total price
    const totalPrice =
      productinfo.price > 0
        ? productinfo.price * quantity
        : productinfo.originalPrice * quantity;

    // Create cart item
    const cartData = {
      user,
      product,
      quantity,
      totalPrice,
    };

    if (productinfo.variantType === "MultiVarient") {
      cartData.variants = variants;
    }

    const addCart = new cartModel(cartData);
    await addCart.save();

    return res.status(201).json({
      success: true,
      message: "Product added to cart successfully",
      data: addCart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      massage: "Internal Server Error",
      error: error.message,
    });
  }
};


const getcartControllers = async (req, res) => {
  try {
    let cartData = await cartModel
      .find({})
      .populate({
        path: "user",
        select: "name email -_id",
      })
      .populate({
        path: "product",
        select: "title stock image price discountprice -_id",
      })
      .populate({
        path: "variants",
        select: "size color stock -_id",
      });
    return res.status(200).json({
      success: true,
      message: "Cart data fetched successfully",
      data: cartData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      massage: "Internal Server Error",
      error: error.message,
    });
  }
};

const getSinglecartControllers = async (req, res) => {
  try {
    let { id } = req.params;
    let singlecartData = await cartModel
      .find({ user: id })
      .select("-user  -createdAt -updatedAt")
      .populate({
        path: "product",
        select: "title image price discountprice _id",
      })
      .populate({
        path: "variants",
        select: "size color _id",
      });
    return res.status(200).json({
      success: true,
      message: "Single cart data fetched successfully",
      data: singlecartData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      massage: "Internal Server Error",
      error: error.message,
    });
  }
};

const updatecartControllers = async (req, res) => {
  try {
    const { id } = req.params; // userId
    const { quantity, variant, product } = req.body; // product = productId

    // 1. Get product info using productId (NOT userId)
    const productinfoData = await productModel.findById(product);
    if (!productinfoData) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // 2. Calculate totalPrice
    const unitPrice =
      productinfoData.price > 0
        ? productinfoData.price
        : productinfoData.originalPrice;

    const totalPrice = unitPrice * quantity;

    // 3. Prepare filter for cart item
    const filter = variant
      ? { user: id, product, variants: variant } // multivariant
      : { user: id, product };                   // simple product

    // 4. Update cart
    const productinfo = await cartModel.findOneAndUpdate(
      filter,
      { quantity, totalPrice },
      { new: true }
    );

    if (!productinfo) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found for this user/product/variant",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      data: productinfo,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      massage: "Internal Server Error",
      error: error.message,
    });
  }
};



const deletecartControllers = async (req, res) => {
  try {
    let { id } = req.params;
    let deletecart = await cartModel.findOneAndDelete({ _id: id });
    return res.status(200).json({
      success: true,
      message: "Cart deleted successfully",
      data: deletecart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      massage: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  addtocartControllers,
  getcartControllers,
  getSinglecartControllers,
  updatecartControllers,
  deletecartControllers,
};

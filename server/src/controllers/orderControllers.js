const cartModel = require("../model/cart.model");
const orderModel = require("../model/order.model");

const SSLCommerzPayment = require("sslcommerz-lts");
const randomnumber = require("../utils/otp");

const store_id = process.env.STORE_ID || "<your_store_id>";
const store_passwd = process.env.STORE_PASSWORD || "<your_store_password>";
const is_live = false; // true for live, false for sandbox

// Place Order
const ordereControllers = async (req, res) => {
  try {
    const otp = randomnumber();

    let {
      user,
      address,
      city,
      phone,
      orderstatus,
      paymentmethod,
      deliverycharge,
      discount,
      totalprice
    } = req.body;

    // Get all cart items for this user
    const cartlist = await cartModel.find({ user });

    if (!cartlist || cartlist.length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "Cart is empty. Please add items to cart before placing an order.",
      });
    }

    // total cart price
    // const totalprice = cartlist.reduce(
    //   (total, item) => total + item.totalPrice,
    //   0
    // );

    // COD ORDER
    if (paymentmethod === "cod") {
      const order = new orderModel({
        user,
        address,
        city,
        phone,
        orderstatus,
        paymentmethod,
        deliverycharge,
        discount,
        items: cartlist,
        totalprice,
      });

      await order.save();

      // clear cart for this user after placing COD order
      await cartModel.deleteMany({ user });

      return res.status(200).json({
        success: true,
        message: "Order placed successfully",
        method: "cod",
        data: order,
      });
    }

    // ONLINE PAYMENT ORDER
    const tran_id = `TRNX${otp}`;

    const order = new orderModel({
      user,
      address,
      city,
      phone,
      orderstatus,
      paymentmethod,
      deliverycharge,
      discount,
      items: cartlist,
      totalprice,
      transactionId: tran_id,
      // paid: "unpaid" // if you have this field in schema you can set default here
    });

    await order.save();

    // SSLCommerz payload
    const data = {
      total_amount: totalprice,
      currency: "BDT",
      tran_id: tran_id, // unique tran_id
      success_url: `http://localhost:4000/api/v1/order/success/${tran_id}`,
      fail_url: `http://localhost:4000/api/v1/order/fail/${tran_id}`,
      cancel_url: "http://localhost:3030/cancel",
      ipn_url: "http://localhost:3030/ipn",
      shipping_method: "Courier",
      product_name: "Computer.",
      product_category: "Electronic",
      product_profile: "general",

      // customer info (you can map from req.body if needed)
      cus_name: "Customer Name",
      cus_email: "customer@example.com",
      cus_add1: "Dhaka",
      cus_add2: "Dhaka",
      cus_city: "Dhaka",
      cus_state: "Dhaka",
      cus_postcode: "1000",
      cus_country: "Bangladesh",
      cus_phone: phone,
      cus_fax: "01711111111",

      // shipping info
      ship_name: "Customer Name",
      ship_add1: address,
      ship_add2: "Dhaka",
      ship_city: city,
      ship_state: "Dhaka",
      ship_postcode: 1000,
      ship_country: "Bangladesh",
    };

    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);

    // init payment
    const apiResponse = await sslcz.init(data);
    const GatewayPageURL = apiResponse.GatewayPageURL;

    // (OPTIONAL) usually you delete cart AFTER payment is confirmed,
    // but you had delete here, so I'm leaving it commented:
    await cartModel.deleteMany({ user });

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      method: "online",
      paymenturl: GatewayPageURL,
      data: order,
    });
  } catch (error) {
    console.error("Order Error:", error);
    return res.status(500).json({
      success: false,
      massage: "Internal Server Error",
      error: error.message,
    });
  }
};

// Get all orders
const getallordersControllers = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate({ path: "user", select: "name email -_id" })
      .populate({
        path: "items.product",
        select: "title image price discountprice -_id",
      })
      .populate({ path: "items.variants", select: "size color stock -_id" });

    return res.status(200).json({
      success: true,
      message: "All orders fetched successfully",
      data: orders,
    });
  } catch (error) {
    console.error("Get Orders Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message || error,
    });
  }
};

// Payment success callback
const odersuccessControllers = async (req, res) => {
  try {
    const { id } = req.params; // transactionId

    const order = await orderModel.findOneAndUpdate(
      { transactionId: id },
      { paid: "paid" },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found for this transaction",
      });
    }

    // now that payment is confirmed, you can safely clear cart:
    await cartModel.deleteMany({ user: order.user });

   return res.redirect("http://localhost:3000/order-success");
  } catch (error) {
    console.error("Order Success Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// Payment failed callback
const orderfailControllers = async (req, res) => {
  try {
    const { id } = req.params; // transactionId

    const order = await orderModel.findOneAndUpdate(
      { transactionId: id },
      { paid: "unpaid" },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found for this transaction",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Payment failed and order updated",
      data: order,
    });
  } catch (error) {
    console.error("Order Fail Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// Cancel handler (you can implement logic if needed)
const ordercancelControllers = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: "Order cancel endpoint hit (not implemented yet)",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

const getSingleorderControllers = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await orderModel
      .findOne({ user: id })
      .populate({ path: "user", select: "name email _id" })
      .populate({
        path: "items.product",
        select: "title image price discountprice _id",
      })
      .populate({ path: "items.variants", select: "size color stock _id" }).sort({ createdAt: -1 });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Single order fetched successfully",
      data: order,
    });
    
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  ordereControllers,
  getallordersControllers,
  odersuccessControllers,
  orderfailControllers,
  ordercancelControllers,
  getSingleorderControllers,
};

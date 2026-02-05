"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Container from "@/components/common/Container";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import {
  MapPin,
  User,
  Mail,
  Phone,
  Home,
  ArrowLeft,
  ShoppingBag,
  Tag,
  X,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";

const Page = () => {
  const router = useRouter();
  const userId = useSelector((state) => state.user.value);

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [city, setCity] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [shippingcharge, setShippingcharge] = useState(0);
  const [coupon, setcoupon] = useState("");
  const [applycopun, setapplycopun] = useState(0);
  const [appliedCouponData, setAppliedCouponData] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);

  const [shippingInfo, setShippingInfo] = useState({
    user: userId?._id,
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Bangladesh",
    paymentMethod: "cod",
  });

  const [errors, setErrors] = useState({});

  // Prefill name & email from logged-in user
  useEffect(() => {
    if (userId?._id) {
      setShippingInfo((prev) => ({
        ...prev,
        fullName: prev.fullName || userId.name || "",
        email: prev.email || userId.email || "",
      }));
    }
  }, [userId]);

  // Fetch cart items
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API}/cart/singlecart/${userId?._id}`
        );
        const apiItems = res?.data?.data || [];
        const mapped = apiItems.map((item) => ({
          _id: item._id,
          productId: item.product?._id,
          title: item.product?.title,
          image: item.product?.image?.[0],
          price:
            item.quantity > 0
              ? item.totalPrice / item.quantity
              : item.product?.price || 0,
          quantity: item.quantity,
          variants: item.variants?._id,
          size: item.variants?.size,
          color: item.variants?.color,
        }));
        setCartItems(mapped);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userId?._id) fetchCart();
    else setLoading(false);
  }, [userId?._id]);

  // Fetch cities
  useEffect(() => {
    axios
      .get("https://bdapi.vercel.app/api/v.1/district")
      .then((res) => {
        setCity(res.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // Fetch divisions
  useEffect(() => {
    axios
      .get("https://bdapi.vercel.app/api/v.1/division")
      .then((res) => {
        setDivisions(res.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handlecoupon = async () => {
    if (!coupon.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }

    setCouponLoading(true);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/coupon/applyCoupons`,
        {
          code: coupon.toUpperCase(),
          orderAmount: subtotal,
        }
      );

      const couponData = res.data.data;
      const minPurchase = Number(couponData.coupon?.minPrice || 0);
      const discount = Number(
        couponData.discountAmount || couponData.coupon?.amout || 0
      );

      // Check if minimum purchase requirement is met
      if (subtotal < minPurchase) {
        toast.error(
          `Minimum purchase amount of ৳${minPurchase} required. You need ৳${(
            minPurchase - subtotal
          ).toFixed(2)} more.`
        );
        setCouponLoading(false);
        return;
      }

      // Apply the coupon
      setapplycopun(discount);
      setAppliedCouponData(couponData.coupon);
      toast.success(`Coupon "${coupon}" applied! You saved ৳${discount}`);
    } catch (err) {
      console.error("Coupon error:", err);
      
      // Only show ONE toast - don't duplicate
      let errorMessage = "Invalid or expired coupon code";
      
      // Check if backend sent a specific message
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      // Show error toast ONCE
      toast.error(errorMessage);
      
      // Reset coupon state
      setapplycopun(0);
      setAppliedCouponData(null);
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setapplycopun(0);
    setAppliedCouponData(null);
    setcoupon("");
    toast.info("Coupon removed");
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = shippingcharge ?? 0;
  const total = subtotal + shipping - applycopun;

  const handleShippingChange = (e) => {
    const { name, value } = e.target;

    setShippingInfo((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    if (name === "city") {
      if (!value) {
        setShippingcharge(0);
      } else if (value === "Dhaka") {
        setShippingcharge(60);
      } else {
        setShippingcharge(120);
      }
    }
  };

  const validateShipping = () => {
    const newErrors = {};

    if (!shippingInfo.fullName.trim())
      newErrors.fullName = "Full name is required";

    if (!shippingInfo.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(shippingInfo.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!shippingInfo.phone.trim())
      newErrors.phone = "Phone number is required";

    if (!shippingInfo.address.trim()) newErrors.address = "Address is required";

    if (!shippingInfo.city.trim()) newErrors.city = "City is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProceedToPayment = async () => {
    if (!validateShipping()) {
      toast.error("Please fill in all required fields");
      return;
    }

    const { paymentMethod } = shippingInfo;

    setProcessing(true);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/order/createorder`,
        {
          user: userId?._id,
          phone: shippingInfo.phone,
          address: shippingInfo.address,
          city: shippingInfo.city,
          paymentmethod: paymentMethod,
          totalprice: total,
          couponCode: appliedCouponData?.code || null,
          discountAmount: applycopun || 0,
        }
      );

      if (res.data.method === "cod") {
        router.push("/order-success");
      } else {
        window.location.href = res.data.paymenturl;
      }
    } catch (err) {
      console.error("Order error:", err);
      toast.error("Failed to create order. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-50 min-h-screen">
        <Container>
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-900">Loading...</h2>
          </div>
        </Container>
      </section>
    );
  }

  if (!cartItems.length) {
    return (
      <section className="py-16 bg-gray-50 min-h-screen">
        <Container>
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <ShoppingBag className="w-24 h-24 mx-auto text-gray-300 mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-8">
              Add some items to your cart to continue shopping
            </p>
            <Link
              href="/allproducts"
              className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-8 py-3 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              Continue Shopping
            </Link>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gray-50 min-h-screen">
      <Container>
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Cart
          </Link>
          <h1 className="text-2xl lg:text-4xl font-bold text-gray-900 lg:mb-2">
            Checkout
          </h1>
          <p className="text-gray-600">Enter your shipping information</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Shipping Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6 lg:p-8">
              <div className="flex items-center gap-3 mb-6">
                <MapPin className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">
                  Shipping Information
                </h2>
              </div>

              <div className="space-y-4">
                {/* Name and Email Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        name="fullName"
                        value={shippingInfo.fullName}
                        onChange={handleShippingChange}
                        className={`w-full pl-10 pr-4 py-3 border ${
                          errors.fullName ? "border-red-500" : "border-gray-300"
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        placeholder="John Doe"
                      />
                    </div>
                    {errors.fullName && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="email"
                        name="email"
                        value={shippingInfo.email}
                        onChange={handleShippingChange}
                        className={`w-full pl-10 pr-4 py-3 border ${
                          errors.email ? "border-red-500" : "border-gray-300"
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        placeholder="john@example.com"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="tel"
                      name="phone"
                      value={shippingInfo.phone}
                      onChange={handleShippingChange}
                      className={`w-full pl-10 pr-4 py-3 border ${
                        errors.phone ? "border-red-500" : "border-gray-300"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="+880 1234567890"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                  )}
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Home className="absolute left-3 top-4 text-gray-400 w-5 h-5" />
                    <textarea
                      name="address"
                      value={shippingInfo.address}
                      onChange={handleShippingChange}
                      rows="3"
                      className={`w-full pl-10 pr-4 py-3 border ${
                        errors.address ? "border-red-500" : "border-gray-300"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="Street address, apartment, suite, etc."
                    />
                  </div>
                  {errors.address && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.address}
                    </p>
                  )}
                </div>

                {/* City, State */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* City */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="city"
                      value={shippingInfo.city}
                      onChange={handleShippingChange}
                      className={`w-full px-4 py-3 border ${
                        errors.city ? "border-red-500" : "border-gray-300"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    >
                      <option value="">Select a city</option>
                      {city.map((item) => (
                        <option key={item.disctrict} value={item.disctrict}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                    {errors.city && (
                      <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                    )}
                  </div>

                  {/* State / Division */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State/Division
                    </label>
                    <select
                      name="state"
                      value={shippingInfo.state}
                      onChange={handleShippingChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select a division</option>
                      {divisions.map((item) => (
                        <option key={item.division} value={item.division}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                    Payment Method
                  </h3>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <label className="flex-1 flex items-center gap-3 border-2 rounded-lg px-4 py-3 cursor-pointer transition hover:border-blue-500 bg-white">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={shippingInfo.paymentMethod === "cod"}
                        onChange={handleShippingChange}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="font-medium">Cash on Delivery (COD)</span>
                    </label>
                    <label className="flex-1 flex items-center gap-3 border-2 rounded-lg px-4 py-3 cursor-pointer transition hover:border-blue-500 bg-white">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="online"
                        checked={shippingInfo.paymentMethod === "online"}
                        onChange={handleShippingChange}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="font-medium">Online Payment</span>
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleProceedToPayment}
                  disabled={processing}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mt-6 shadow-lg"
                >
                  {processing ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Processing...
                    </span>
                  ) : (
                    "Proceed to Payment"
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Order Summary
              </h2>

              {/* Cart Items */}
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex gap-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-gray-900 line-clamp-1">
                        {item.title}
                      </h4>
                      {(item.size || item.color) && (
                        <p className="text-xs text-gray-600">
                          {item.size && `Size: ${item.size}`}
                          {item.size && item.color && " • "}
                          {item.color && `Color: ${item.color}`}
                        </p>
                      )}
                      <p className="text-sm text-gray-600">
                        Qty: {item.quantity}
                      </p>
                      <p className="text-sm font-bold text-gray-900">
                        ৳{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo Code */}
              <div className="mb-6 border-b border-gray-200 pb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Promo Code
                </label>

                {appliedCouponData ? (
                  <div className="bg-green-50 border-2 border-green-500 rounded-lg p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="text-sm font-bold text-green-700">
                          {appliedCouponData.code}
                        </p>
                        <p className="text-xs text-green-600">
                          You saved ৳{applycopun.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-red-500 hover:text-red-700 transition"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={coupon}
                      onChange={(e) => setcoupon(e.target.value.toUpperCase())}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handlecoupon();
                        }
                      }}
                      placeholder="Enter code"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
                      disabled={couponLoading}
                    />
                    <button
                      onClick={handlecoupon}
                      disabled={couponLoading || !coupon.trim()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {couponLoading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      ) : (
                        "Apply"
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-4 pb-6 border-b border-gray-200">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium">৳{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? "Free" : `৳${shipping.toFixed(2)}`}
                  </span>
                </div>
                {applycopun > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span className="flex items-center gap-1">
                      <Tag className="w-4 h-4" />
                      Discount
                    </span>
                    <span className="font-medium">
                      -৳{applycopun.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-gray-900">Total</span>
                <span className="lg:text-3xl text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ৳{total.toFixed(2)}
                </span>
              </div>

              {applycopun > 0 && (
                <p className="text-xs text-green-600 text-center mt-2">
                  🎉 You saved ৳{applycopun.toFixed(2)} with this coupon!
                </p>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Page;
"use client";
import React, { useState, useEffect } from "react";
import Container from "@/components/common/Container";
import Link from "next/link";
import { useParams } from "next/navigation";
import axios from "axios";
import {
  CheckCircle,
  Package,
  Truck,
  MapPin,
  Mail,
  Phone,
  Calendar,
  CreditCard,
  Download,
  Home,
} from "lucide-react";
import { useSelector } from "react-redux";

const Page = () => {
  const userId = useSelector((state) => state.user.value);
  // const params = useParams()
  const orderId = userId?._id;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const fetchOrder = async () => {
  //     try {
  //       const res = await axios.get( `${process.env.NEXT_PUBLIC_API}/order/singleorder/${user?._id}`).then((res)=>{
  //         console.log(res)
  //       })

  //       // setOrder(res?.data?.data)
  //       return

  //     } catch (err) {
  //       console.error('Error fetching order:', err)
  //     } finally {
  //       setLoading(false)
  //     }
  //   }

  //   if (orderId) {
  //     fetchOrder()
  //   } else {
  //     setLoading(false)
  //   }
  // }, [orderId])

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API}/order/singleorder/${orderId}`)
      .then((res) => {
        setOrder(res?.data?.data);
      })
      .catch((err) => {
        console.error("Error fetching order data:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [orderId]);

  const handleDownloadInvoice = () => {
    // Implement invoice download logic
    console.log("Download invoice for order:", orderId);
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-50 min-h-screen">
        <Container>
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Loading order details...
            </h2>
          </div>
        </Container>
      </section>
    );
  }

  // Mock data if order not found
  const orderData = order || {
    _id: orderId || "12345",
    orderNumber: `ORD-${Date.now().toString().slice(-6)}`,
    createdAt: new Date().toISOString(),
    paymentMethod: "cod",
    status: "pending",
    items: [],
    shippingInfo: {
      fullName: "John Doe",
      email: "john@example.com",
      phone: "+880 1234567890",
      address: "123 Main Street, Apartment 4B",
      city: "Dhaka",
      zipCode: "1000",
    },
    subtotal: 0,
    shipping: 0,
    tax: 0,
    total: 0,
    estimatedDelivery: new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    ).toISOString(),
  };

  const subtotal =
    orderData.items?.reduce(
      (sum, item) => sum + item.product?.price * item.quantity,
      0
    ) || 0;

  const shipping = orderData.city === "Dhaka" ? 60 : 120;
  const grandTotal = orderData.totalprice || subtotal + shipping;

  return (
    <section className="py-12 bg-gradient-to-b from-green-50 to-gray-50 min-h-screen">
      <Container>
        {/* Success Header */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            {/* Success Animation */}
            <div className="mb-6 relative">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center animate-bounce">
                <CheckCircle className="w-16 h-16 text-white" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 bg-green-200 rounded-full opacity-20 animate-ping"></div>
              </div>
            </div>

            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
              Order Placed Successfully!
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Thank you for your order. We've received your order and will
              process it shortly.
            </p>

            {/* Order Number */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-1">Order Number</p>
              <p className="text-2xl font-bold text-gray-900">
                {orderData.transactionId || `ODN-${Date.now().toString().slice(-4)}`}
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={handleDownloadInvoice}
                className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
              >
                <Download className="w-5 h-5" />
                Download Invoice
              </button>
              <Link
                href="/orders"
                className="inline-flex items-center gap-2 bg-gray-200 text-gray-700 font-semibold px-6 py-3 rounded-lg hover:bg-gray-300 transition-all duration-300"
              >
                <Package className="w-5 h-5" />
                View All Orders
              </Link>
            </div>
          </div>
        </div>

        {/* Order Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Payment Info Card */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <CreditCard className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Payment Info</h3>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Payment Method</p>
                <p className="text-base font-semibold text-gray-900 capitalize">
                  {orderData.paymentmethod === "online"
                    ? "Online Payment"
                    : orderData.paymentmethod === "cod"
                    ? "Cash on Delivery"
                    : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Payment Status</p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    orderData.paymentMethod === "cod"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {orderData.paymentmethod === "cod"
                    ? "Pay on Delivery"
                    : "Paid"}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-2xl font-bold text-gray-900">
                  ৳{orderData.totalprice?.toFixed(2) || "0.00"}
                </p>
              </div>
            </div>
          </div>

          {/* Delivery Info Card */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Truck className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Delivery Info</h3>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Estimated Delivery</p>
                <p className="text-base font-semibold text-gray-900">
                  {new Date(orderData.estimatedDelivery).toLocaleDateString(
                    "en-US",
                    {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    }
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Order Status</p>
                <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700 capitalize">
                  {orderData.orderstatus || "Processing"}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Tracking Number</p>
                <p className="text-sm text-gray-500">Available once shipped</p>
              </div>
            </div>
          </div>

          {/* Order Date Card */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Order Date</h3>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Placed On</p>
                <p className="text-base font-semibold text-gray-900">
                  {new Date(orderData.createdAt).toLocaleDateString("en-US", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Time</p>
                <p className="text-base font-semibold text-gray-900">
                  {new Date(orderData.createdAt).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Order ID</p>
                <p className="text-sm font-mono text-gray-600">
                  #{orderData._id?.slice(-8) || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Address & Order Items */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Shipping Address */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-bold text-gray-900">
                Shipping Address
              </h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="bg-gray-100 p-2 rounded-lg">
                  <Home className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {orderData?.user?.name}
                  </p>
                  <p className="text-gray-600 text-sm">{orderData.address}</p>
                  <p className="text-gray-600 text-sm">
                    {orderData.city}, {orderData.zipCode}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-gray-200">
                <Phone className="w-5 h-5 text-gray-600" />
                <p className="text-gray-900">{orderData.phone}</p>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-600" />
                <p className="text-gray-900">{orderData.user?.email}</p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Order Summary
            </h3>

            {orderData.items && orderData.items.length > 0 ? (
              <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                {orderData.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex gap-3 pb-3 border-b border-gray-100 last:border-0"
                  >
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <img
                        src={item.product?.image?.[0] || "/placeholder.png"}
                        alt={item.product?.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-gray-900 line-clamp-1">
                        {item.product?.title || "Product"}
                      </h4>
                      <p className="text-xs text-gray-600">
                        Qty: {item.quantity}
                      </p>
                      <p className="text-sm font-bold text-gray-900">
                        ৳{((item.product?.price || 0) ).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-sm mb-4">
                No items in this order
              </p>
            )}

            <div className="space-y-2 pt-4 border-t border-gray-200">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium">৳{subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="font-medium">৳{shipping}</span>
              </div>

              <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200">
                <span>Total</span>
                <span>৳{grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* What's Next Section */}
        <div className="bg-white rounded-xl shadow-md p-8 mt-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            What Happens Next?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Order Processing
              </h4>
              <p className="text-sm text-gray-600">
                We're preparing your order for shipment
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">On the Way</h4>
              <p className="text-sm text-gray-600">
                Your order will be shipped within 1-2 business days
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Delivered</h4>
              <p className="text-sm text-gray-600">
                Estimated delivery: 5-7 business days
              </p>
            </div>
          </div>
        </div>

        {/* Continue Shopping */}
        <div className="text-center mt-8">
          <Link
            href="/"
            className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-8 py-3 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            Continue Shopping
          </Link>
        </div>
      </Container>
    </section>
  );
};

export default Page;

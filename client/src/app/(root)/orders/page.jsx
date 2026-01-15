"use client";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import axios from "axios";
import { Package, ShoppingCart } from "lucide-react";

const Page = () => {
  const user = useSelector((state) => state.user.value);



  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?._id) return;

    axios
      .get(
        `${process.env.NEXT_PUBLIC_API}/order/singleuserorder/${user?._id}`
      )
      .then((res) => {
       const result = res?.data?.data;
setOrders(Array.isArray(result) ? result : result ? [result] : []);

      })
      .catch((err) => {
        console.error("Order fetch error:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user?._id]);

  console.log(orders)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-10">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-600 mt-1">
            View and track all your orders
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full"></div>
            </div>
          )}

          {/* Empty State */}
          {!loading && orders.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="bg-gray-100 p-6 rounded-full mb-6">
                <ShoppingCart className="w-12 h-12 text-gray-400" />
              </div>

              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                No Orders Found
              </h2>
              <p className="text-gray-600 mb-6">
                You haven&apos;t placed any orders yet
              </p>

              <Link
                href="/"
                className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
              >
                Start Shopping
              </Link>
            </div>
          )}

          {/* Orders List */}
          {!loading && orders.length > 0 && (
            <div className="space-y-6">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition"
                >
                  {/* Order Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">
                        Order ID
                      </p>
                      <p className="font-medium text-gray-900">
                        #{order._id}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          order.orderstatus === "Delivered"
                            ? "bg-green-100 text-green-700"
                            : order.orderstatus === "Cancelled"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {order.orderstatus || "Pending"}
                      </span>
                    </div>
                  </div>

                  {/* Order Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Items</p>
                      <p className="font-medium text-gray-900">
                        {order?.items?.length || 0} items
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-500">Total Amount</p>
                      <p className="font-semibold text-blue-600">
                        ৳{order.totalprice}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-500">Order Date</p>
                      <p className="font-medium text-gray-900">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Ordered Products Preview */}
{order?.items?.length > 0 && (
  <div className="mt-4 border-t border-gray-200 pt-4">
    <p className="text-sm font-medium text-gray-700 mb-3">
      Ordered Products
    </p>

    <div className="space-y-3">
      {order.items.map((item, index) => {
        const product = item.product || item;

        return (
          <div
            key={index}
            className="flex items-center gap-3"
          >
            {/* Product Image */}
            <div className="w-16 h-16 rounded-lg border border-gray-200 overflow-hidden bg-white">
              <img
                src={product.image[0]}
                alt={product.title}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Product Title */}
            <div className="flex-1">
              <p className="text-base text-gray-900 font-medium line-clamp-1">
                {product.title}
              </p>
              <p className="text-sm text-gray-500">
                Qty: {item.quantity || 1}
              </p> 
               <p className="text-sm font-semibold text-blue-500">
                Price: ৳{item.product.discountprice || item.product.price} 
              </p>
            </div>
          </div>
        );
      })}
    </div>
  </div>
)}


               
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;

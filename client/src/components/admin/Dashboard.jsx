"use client";
import React, { useEffect, useState } from "react";
import {
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  AlertCircle,
  Eye,
  Tag,
  Star,
  ShoppingBag,
} from "lucide-react";
import axios from "axios";
import Link from "next/link";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
    shippingOrders: 0,
    newProducts: 0,
    featuredProducts: 0,
    menProducts: 0,
    womenProducts: 0,
    kidsProducts: 0,
    accessoriesProducts: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [salesData, setSalesData] = useState({
    today: 0,
    thisWeek: 0,
    thisMonth: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch all data in parallel
      const [
        allProductsRes,
        menProductsRes,
        womenProductsRes,
        kidsProductsRes,
        accessoriesRes,
        featuredProductsRes,
        newProductsRes,
        allOrdersRes,
      ] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_API}/products/allproducts`),
        axios.get(`${process.env.NEXT_PUBLIC_API}/products/menproducts`),
        axios.get(`${process.env.NEXT_PUBLIC_API}/products/womenproducts`),
        axios.get(`${process.env.NEXT_PUBLIC_API}/products/kidsproducts`),
        axios.get(`${process.env.NEXT_PUBLIC_API}/products/accessoriesproducts`),
        axios.get(`${process.env.NEXT_PUBLIC_API}/products/featuredproducts`),
        axios.get(`${process.env.NEXT_PUBLIC_API}/products/leastproduct`),
        axios.get(`${process.env.NEXT_PUBLIC_API}/order/getallorders`),
      ]);

      const products = allProductsRes?.data?.data || [];
      const menProducts = menProductsRes?.data?.data || [];
      const womenProducts = womenProductsRes?.data?.data || [];
      const kidsProducts = kidsProductsRes?.data?.data || [];
      const accessoriesProducts = accessoriesRes?.data?.data || [];
      const featuredProducts = featuredProductsRes?.data?.data || [];
      const newProducts = newProductsRes?.data?.data || [];
      const orders = allOrdersRes?.data?.data || [];

      // Calculate order statistics
      const totalRevenue = orders.reduce(
        (sum, order) => sum + (order.totalprice || 0),
        0
      );

      const pendingOrders = orders.filter(
        (o) => o.orderstatus === "pending"
      ).length;
      const completedOrders = orders.filter(
        (o) => o.orderstatus === "delivered"
      ).length;
      const cancelledOrders = orders.filter(
        (o) => o.orderstatus === "cancelled"
      ).length;
      const shippingOrders = orders.filter(
        (o) => o.orderstatus === "shipping" || o.orderstatus === "confirmed"
      ).length;

      // Get unique customers count
      const uniqueCustomers = new Set(
        orders.map((o) => o.user?._id).filter(Boolean)
      ).size;

      // Calculate sales data by time period
      const now = new Date();
      const todayStart = new Date(now.setHours(0, 0, 0, 0));
      const weekStart = new Date(now.setDate(now.getDate() - 7));
      const monthStart = new Date(now.setDate(1));

      const todaySales = orders
        .filter((o) => new Date(o.createdAt) >= todayStart)
        .reduce((sum, o) => sum + (o.totalprice || 0), 0);

      const weekSales = orders
        .filter((o) => new Date(o.createdAt) >= weekStart)
        .reduce((sum, o) => sum + (o.totalprice || 0), 0);

      const monthSales = orders
        .filter((o) => new Date(o.createdAt) >= monthStart)
        .reduce((sum, o) => sum + (o.totalprice || 0), 0);

      setSalesData({
        today: todaySales,
        thisWeek: weekSales,
        thisMonth: monthSales,
      });

      setStats({
        totalProducts: products.length,
        totalOrders: orders.length,
        totalCustomers: uniqueCustomers,
        totalRevenue,
        pendingOrders,
        completedOrders,
        cancelledOrders,
        shippingOrders,
        newProducts: newProducts.length,
        featuredProducts: featuredProducts.length,
        menProducts: menProducts.length,
        womenProducts: womenProducts.length,
        kidsProducts: kidsProducts.length,
        accessoriesProducts: accessoriesProducts.length,
      });

      // Get recent 10 orders
      const sortedOrders = orders.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setRecentOrders(sortedOrders.slice(0, 10));

      // Get top 5 featured products
      setTopProducts(featuredProducts.slice(0, 5));

      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setLoading(false);
    }
  };

  // Calculate growth percentages (mock data for now, you can calculate from historical data)
  const calculateGrowth = (category) => {
    // This is mock data - you would calculate this from actual historical data
    const growthRates = {
      revenue: 12.5,
      orders: 8.2,
      products: 3.1,
      customers: 5.7,
    };
    return growthRates[category] || 0;
  };

  const statCards = [
    {
      title: "Total Revenue",
      value: `৳${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "bg-green-500",
      trend: `+${calculateGrowth("revenue")}%`,
      trendUp: true,
      link: "/admin/orders",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: "bg-blue-500",
      trend: `+${calculateGrowth("orders")}%`,
      trendUp: true,
      link: "/admin/orders",
    },
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      color: "bg-purple-500",
      trend: `+${calculateGrowth("products")}%`,
      trendUp: true,
      link: "/admin/products",
    },
    {
      title: "Total Customers",
      value: stats.totalCustomers,
      icon: Users,
      color: "bg-orange-500",
      trend: `+${calculateGrowth("customers")}%`,
      trendUp: true,
      link: "/admin/users",
    },
  ];

  const orderStatusCards = [
    {
      title: "Pending Orders",
      value: stats.pendingOrders,
      icon: Clock,
      color: "bg-yellow-500",
      description: "Awaiting confirmation",
    },
    {
      title: "Shipping Orders",
      value: stats.shippingOrders,
      icon: Truck,
      color: "bg-blue-500",
      description: "In transit",
    },
    {
      title: "Completed Orders",
      value: stats.completedOrders,
      icon: CheckCircle,
      color: "bg-green-500",
      description: "Successfully delivered",
    },
    {
      title: "Cancelled Orders",
      value: stats.cancelledOrders,
      icon: XCircle,
      color: "bg-red-500",
      description: "Cancelled by user/admin",
    },
  ];

  const productCategoryCards = [
    {
      title: "Men's Products",
      value: stats.menProducts,
      icon: ShoppingBag,
      color: "bg-blue-600",
    },
    {
      title: "Women's Products",
      value: stats.womenProducts,
      icon: ShoppingBag,
      color: "bg-pink-600",
    },
    {
      title: "Kids Products",
      value: stats.kidsProducts,
      icon: ShoppingBag,
      color: "bg-purple-600",
    },
    {
      title: "Accessories",
      value: stats.accessoriesProducts,
      icon: Tag,
      color: "bg-amber-600",
    },
    {
      title: "New Products",
      value: stats.newProducts,
      icon: Star,
      color: "bg-emerald-600",
    },
    {
      title: "Featured Products",
      value: stats.featuredProducts,
      icon: Star,
      color: "bg-indigo-600",
    },
  ];

  const getStatusColor = (status) => {
    const statusColors = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      shipping: "bg-blue-100 text-blue-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return statusColors[status] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Dashboard Overview
        </h1>
        <p className="text-gray-600 mt-1">
          Welcome back! Here's what's happening with your store today.
        </p>
      </div>

      {/* Quick Actions Alert */}
      {stats.pendingOrders > 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-yellow-800">
              You have {stats.pendingOrders} pending order
              {stats.pendingOrders > 1 ? "s" : ""} waiting for confirmation
            </p>
            <Link
              href="/admin/orders"
              className="text-sm text-yellow-700 hover:text-yellow-900 underline"
            >
              View pending orders →
            </Link>
          </div>
        </div>
      )}

      {/* Sales Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <p className="text-blue-100 text-sm font-medium mb-2">Today's Sales</p>
          <p className="text-3xl font-bold">৳{salesData.today.toLocaleString()}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <p className="text-purple-100 text-sm font-medium mb-2">This Week</p>
          <p className="text-3xl font-bold">
            ৳{salesData.thisWeek.toLocaleString()}
          </p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <p className="text-green-100 text-sm font-medium mb-2">This Month</p>
          <p className="text-3xl font-bold">
            ৳{salesData.thisMonth.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((stat, index) => (
          <Link
            href={stat.link}
            key={index}
            className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-3 rounded-lg shadow-md`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center gap-1 text-sm">
                {stat.trendUp ? (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                )}
                <span className={stat.trendUp ? "text-green-500" : "text-red-500"}>
                  {stat.trend}
                </span>
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium">{stat.title}</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
          </Link>
        ))}
      </div>

      {/* Order Status Grid */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Order Status Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {orderStatusCards.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`${stat.color} p-2 rounded-lg shadow-sm`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-gray-700 text-sm font-semibold">{stat.title}</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Product Categories Grid */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Product Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {productCategoryCards.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition"
            >
              <div className={`${stat.color} p-2 rounded-lg w-fit mb-3`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-600 mt-1">{stat.title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Orders & Top Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
            <Link
              href="/admin/orders"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
            >
              View All
              <Eye className="w-4 h-4" />
            </Link>
          </div>
          <div className="overflow-x-auto max-h-96">
            {recentOrders.length > 0 ? (
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Order ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Customer
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentOrders.slice(0, 8).map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        #{order._id.slice(-6).toUpperCase()}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 truncate max-w-[150px]">
                        {order.user?.name || "Guest"}
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                        ৳{order.totalprice?.toLocaleString() || 0}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            order.orderstatus
                          )}`}
                        >
                          {order.orderstatus || "pending"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p>No orders found</p>
              </div>
            )}
          </div>
        </div>

        {/* Top Featured Products */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Featured Products</h2>
            <Link
              href="/admin/products"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
            >
              View All
              <Eye className="w-4 h-4" />
            </Link>
          </div>
          <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
            {topProducts.length > 0 ? (
              topProducts.map((product) => (
                <div
                  key={product._id}
                  className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-white border border-gray-200 flex-shrink-0">
                    <img
                      src={product.image?.[0]}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-gray-900 line-clamp-1">
                      {product.title}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      Stock: {product.stock || 0}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-sm font-bold text-blue-600">
                        ৳{product.price}
                      </p>
                      {product.originalPrice && (
                        <p className="text-xs text-gray-400 line-through">
                          ৳{product.originalPrice}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {product.isFeatured && (
                      <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full">
                        Featured
                      </span>
                    )}
                    {product.isNew && (
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                        New
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-8">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p>No featured products</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
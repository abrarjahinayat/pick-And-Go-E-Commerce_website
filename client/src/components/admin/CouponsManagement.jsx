"use client";
import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Tag,
  X,
  Copy,
  Check,
  Eye,
  EyeOff,
  Calendar,
  DollarSign,
  ShoppingCart,
  Users,
  Percent,
  TrendingUp,
  Filter,
  Search,
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

const CouponsManagement = () => {
  const [coupons, setCoupons] = useState([]);
  const [filteredCoupons, setFilteredCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentCoupon, setCurrentCoupon] = useState(null);
  const [copiedCode, setCopiedCode] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    code: "",
    minPrice: "",
    amout: "",
    description: "",
    expiryDate: "",
    usageLimit: "",
    isActive: true,
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  useEffect(() => {
    filterCoupons();
  }, [coupons, filterStatus, searchQuery]);

  const fetchCoupons = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API}/coupon/allcoupon`
      );
      setCoupons(res?.data?.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching coupons:", error);
      toast.error("Failed to load coupons");
      setLoading(false);
    }
  };

  const filterCoupons = () => {
    let filtered = [...coupons];

    // Filter by status
    if (filterStatus === "active") {
      filtered = filtered.filter((c) => c.isActive && !isExpired(c.expiryDate));
    } else if (filterStatus === "inactive") {
      filtered = filtered.filter((c) => !c.isActive);
    } else if (filterStatus === "expired") {
      filtered = filtered.filter((c) => isExpired(c.expiryDate));
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (c) =>
          c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredCoupons(filtered);
  };

  const generateRandomCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({ ...formData, code });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.code || !formData.minPrice || !formData.amout) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (Number(formData.minPrice) < 0) {
      toast.error("Minimum price cannot be negative");
      return;
    }

    if (Number(formData.amout) <= 0) {
      toast.error("Discount amount must be greater than 0");
      return;
    }

    try {
      if (editMode && currentCoupon) {
        const res = await axios.put(
          `${process.env.NEXT_PUBLIC_API}/coupon/updatecoupon/${currentCoupon._id}`,
          formData
        );

        if (res.data.success) {
          toast.success("Coupon updated successfully!");
          fetchCoupons();
          handleCloseModal();
        }
      } else {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API}/coupon/createCoupon`,
          formData
        );

        if (res.data.success) {
          toast.success("Coupon added successfully!");
          fetchCoupons();
          handleCloseModal();
        }
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error(error?.response?.data?.message || "Operation failed");
    }
  };

  const handleEdit = (coupon) => {
    setCurrentCoupon(coupon);
    setFormData({
      code: coupon.code,
      minPrice: coupon.minPrice,
      amout: coupon.amout,
      description: coupon.description || "",
      expiryDate: coupon.expiryDate
        ? new Date(coupon.expiryDate).toISOString().split("T")[0]
        : "",
      usageLimit: coupon.usageLimit || "",
      isActive: coupon.isActive,
    });
    setEditMode(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this coupon?")) return;

    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_API}/coupon/deletecoupon/${id}`
      );

      if (res.data.success) {
        toast.success("Coupon deleted successfully!");
        fetchCoupons();
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete coupon");
    }
  };

  const toggleCouponStatus = async (id) => {
    try {
      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_API}/coupon/togglestatus/${id}`
      );

      if (res.data.success) {
        toast.success(res.data.message);
        fetchCoupons();
      }
    } catch (error) {
      console.error("Toggle status error:", error);
      toast.error("Failed to update coupon status");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditMode(false);
    setCurrentCoupon(null);
    setFormData({
      code: "",
      minPrice: "",
      amout: "",
      description: "",
      expiryDate: "",
      usageLimit: "",
      isActive: true,
    });
  };

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success("Coupon code copied!");
    setTimeout(() => setCopiedCode(""), 2000);
  };

  const isExpired = (date) => {
    if (!date) return false;
    return new Date(date) < new Date();
  };

  // Statistics
  const stats = {
    total: coupons.length,
    active: coupons.filter((c) => c.isActive && !isExpired(c.expiryDate)).length,
    expired: coupons.filter((c) => isExpired(c.expiryDate)).length,
    inactive: coupons.filter((c) => !c.isActive).length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 font-medium">Loading coupons...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Coupon Management
          </h1>
          <p className="text-gray-600 mt-1">
            Create and manage discount coupons for your store
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
          <span>Add Coupon</span>
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Coupons</p>
              <p className="text-3xl font-bold mt-2">{stats.total}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <Tag className="w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Active</p>
              <p className="text-3xl font-bold mt-2">{stats.active}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <TrendingUp className="w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium">Expired</p>
              <p className="text-3xl font-bold mt-2">{stats.expired}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <Calendar className="w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-100 text-sm font-medium">Inactive</p>
              <p className="text-3xl font-bold mt-2">{stats.inactive}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <EyeOff className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search coupons by code or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="all">All Coupons</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="expired">Expired</option>
            </select>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Showing {filteredCoupons.length} of {coupons.length} coupons
        </p>
      </div>

      {/* Coupons Grid */}
      {filteredCoupons.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCoupons.map((coupon) => {
            const expired = isExpired(coupon.expiryDate);
            const isActive = coupon.isActive && !expired;

            return (
              <div
                key={coupon._id}
                className={`bg-white rounded-xl shadow-md border-2 p-6 hover:shadow-xl transition-all duration-300 ${
                  isActive
                    ? "border-green-200"
                    : expired
                    ? "border-red-200 opacity-75"
                    : "border-gray-200 opacity-75"
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-3 rounded-lg shadow-md">
                    <Tag className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleCouponStatus(coupon._id)}
                      className={`p-2 rounded-lg transition ${
                        coupon.isActive
                          ? "text-green-600 hover:bg-green-50"
                          : "text-gray-400 hover:bg-gray-50"
                      }`}
                      title={coupon.isActive ? "Deactivate" : "Activate"}
                    >
                      {coupon.isActive ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => handleEdit(coupon)}
                      className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(coupon._id)}
                      className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Coupon Code */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <code className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg font-bold text-lg tracking-wider flex-1 text-center shadow-md">
                      {coupon.code}
                    </code>
                    <button
                      onClick={() => copyToClipboard(coupon.code)}
                      className="text-gray-400 hover:text-gray-600 transition p-2 hover:bg-gray-100 rounded-lg"
                      title="Copy code"
                    >
                      {copiedCode === coupon.code ? (
                        <Check className="w-5 h-5 text-green-500" />
                      ) : (
                        <Copy className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Discount Info */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-green-600" />
                      <span className="text-sm text-gray-600">Discount</span>
                    </div>
                    <span className="font-bold text-green-600 text-lg">
                      ৳{coupon.amout}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <ShoppingCart className="w-5 h-5 text-blue-600" />
                      <span className="text-sm text-gray-600">Min Purchase</span>
                    </div>
                    <span className="font-semibold text-blue-600">
                      ৳{coupon.minPrice}
                    </span>
                  </div>

                  {coupon.usageLimit && (
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-purple-600" />
                        <span className="text-sm text-gray-600">Usage</span>
                      </div>
                      <span className="font-semibold text-purple-600">
                        {coupon.usedCount || 0} / {coupon.usageLimit}
                      </span>
                    </div>
                  )}
                </div>

                {/* Description */}
                {coupon.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {coupon.description}
                  </p>
                )}

                {/* Status Badges */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {isActive ? (
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      Active
                    </span>
                  ) : !coupon.isActive ? (
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full flex items-center gap-1">
                      <EyeOff className="w-3 h-3" />
                      Inactive
                    </span>
                  ) : expired ? (
                    <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Expired
                    </span>
                  ) : null}

                  {coupon.expiryDate && !expired && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                      Expires: {new Date(coupon.expiryDate).toLocaleDateString()}
                    </span>
                  )}
                </div>

                {/* Footer */}
                <div className="text-xs text-gray-500 pt-3 border-t border-gray-100">
                  Created: {new Date(coupon.createdAt).toLocaleDateString()}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
          <Tag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No coupons found
          </h3>
          <p className="text-gray-600 mb-4">
            {searchQuery || filterStatus !== "all"
              ? "Try adjusting your filters"
              : "Start by creating your first coupon"}
          </p>
          {!searchQuery && filterStatus === "all" && (
            <button
              onClick={() => setShowModal(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition"
            >
              <Plus className="w-5 h-5 inline-block mr-2" />
              Add Coupon
            </button>
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 my-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {editMode ? "Edit Coupon" : "Add New Coupon"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Coupon Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Coupon Code <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        code: e.target.value.toUpperCase(),
                      })
                    }
                    placeholder="SUMMER2024"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono font-bold"
                    required
                    maxLength={20}
                  />
                  <button
                    type="button"
                    onClick={generateRandomCode}
                    className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
                  >
                    Generate
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Use uppercase letters and numbers only
                </p>
              </div>

              {/* Discount Amount & Min Price */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discount Amount (৳) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="number"
                      value={formData.amout}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          amout: e.target.value,
                        })
                      }
                      placeholder="100"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      min="1"
                      step="0.01"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Min Purchase (৳) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <ShoppingCart className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="number"
                      value={formData.minPrice}
                      onChange={(e) =>
                        setFormData({ ...formData, minPrice: e.target.value })
                      }
                      placeholder="500"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
              </div>

              {/* Expiry Date & Usage Limit */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date (Optional)
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="date"
                      value={formData.expiryDate}
                      onChange={(e) =>
                        setFormData({ ...formData, expiryDate: e.target.value })
                      }
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Usage Limit (Optional)
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="number"
                      value={formData.usageLimit}
                      onChange={(e) =>
                        setFormData({ ...formData, usageLimit: e.target.value })
                      }
                      placeholder="100"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="1"
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows="3"
                  placeholder="Summer sale discount - Get ৳100 off on orders above ৳500"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  maxLength={200}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.description.length}/200 characters
                </p>
              </div>

              {/* Active Status */}
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
                <label
                  htmlFor="isActive"
                  className="text-sm font-medium text-gray-700 flex items-center gap-2"
                >
                  {formData.isActive ? (
                    <Eye className="w-4 h-4 text-green-600" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-red-600" />
                  )}
                  Set as Active Coupon
                </label>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition font-medium"
                >
                  {editMode ? "Update" : "Add"} Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouponsManagement;
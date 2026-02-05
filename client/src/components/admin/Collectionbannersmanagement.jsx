"use client";
import React, { useState, useEffect } from "react";
import {
  Upload,
  Trash2,
  Plus,
  X,
  Image as ImageIcon,
  Link as LinkIcon,
  Edit,
  Tag,
  Layers,
  Eye,
  EyeOff,
  Filter,
  Search,
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

const CollectionBannersManagement = () => {
  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [selectedCollection, setSelectedCollection] = useState("all");
  const [formData, setFormData] = useState({
    title: "",
    link: "",
    category: "",
    isActive: true,
  });

  // Collection types based on your backend
  const collectionTypes = [
    { value: "Designer Polo", label: "Designer Polo", color: "blue" },
    {
      value: "Kurti Tunic And Tops",
      label: "Kurti Tunic And Tops",
      color: "purple",
    },
    { value: "Panjabi", label: "Panjabi", color: "green" },
    { value: "Cargo Denims", label: "Cargo Denims", color: "orange" },
    { value: "Little Ones Tees", label: "Little Ones Tees", color: "pink" },
    { value: "Premium Sockes", label: "Premium Sockes", color: "indigo" },
    { value: "Women Products", label: "Women Products", color: "red" },
  ];

  useEffect(() => {
    fetchAllBanners();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API}/category/getallcategory`
      );
      setCategories(res?.data?.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    }
  };

  const fetchAllBanners = async () => {
    try {
      setLoading(true);
      
      // Try the new unified endpoint first
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API}/productcollectionbanner/getallproductcollectionbanners`
        );
        setBanners(res?.data?.data || []);
        setLoading(false);
        return;
      } catch (error) {
        // If 404, fall back to individual endpoints
        if (error.response?.status === 404) {
          console.log("Using individual endpoints...");
        } else {
          throw error;
        }
      }

      // Fallback: Fetch banners from all collection endpoints individually
      const [
        designerPolo,
        kurtiTops,
        panjabi,
        cargoDenims,
        littleOnes,
        premiumSocks,
        womenProducts,
      ] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_API}/productcollectionbanner/getdesignerpolobanner`),
        axios.get(`${process.env.NEXT_PUBLIC_API}/productcollectionbanner/getkurtitopsbanner`),
        axios.get(`${process.env.NEXT_PUBLIC_API}/productcollectionbanner/getpanjabibanner`),
        axios.get(`${process.env.NEXT_PUBLIC_API}/productcollectionbanner/getcargodenimsbanner`),
        axios.get(`${process.env.NEXT_PUBLIC_API}/productcollectionbanner/getlittleonesteesbanner`),
        axios.get(`${process.env.NEXT_PUBLIC_API}/productcollectionbanner/getpremiumsockesbanner`),
        axios.get(`${process.env.NEXT_PUBLIC_API}/productcollectionbanner/getwomenproductsbanner`),
      ]);

      // Combine all banners
      const allBanners = [
        ...(designerPolo?.data?.data || []),
        ...(kurtiTops?.data?.data || []),
        ...(panjabi?.data?.data || []),
        ...(cargoDenims?.data?.data || []),
        ...(littleOnes?.data?.data || []),
        ...(premiumSocks?.data?.data || []),
        ...(womenProducts?.data?.data || []),
      ];

      setBanners(allBanners);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching banners:", error);
      toast.error("Failed to load collection banners");
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should be less than 5MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile && !editMode) {
      toast.error("Please select a banner image");
      return;
    }

    if (!formData.title) {
      toast.error("Please select a collection type");
      return;
    }

    if (!formData.link.trim()) {
      toast.error("Please enter a link");
      return;
    }

    if (!formData.category) {
      toast.error("Please select a category");
      return;
    }

    setUploading(true);

    try {
      const formDataToSend = new FormData();

      if (selectedFile) {
        formDataToSend.append("productbanner", selectedFile);
      }
      formDataToSend.append("title", formData.title);
      formDataToSend.append("link", formData.link);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("isActive", formData.isActive);

      if (editMode && currentBanner) {
        // Update banner
        const res = await axios.patch(
          `${process.env.NEXT_PUBLIC_API}/productcollectionbanner/updateproductcollectionbanner/${currentBanner._id}`,
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (res.data.success) {
          toast.success("Collection banner updated successfully!");
          fetchAllBanners();
          handleCloseModal();
        }
      } else {
        // Add new banner
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API}/productcollectionbanner/addproductCollectionBanner`,
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (res.data.success) {
          toast.success("Collection banner added successfully!");
          fetchAllBanners();
          handleCloseModal();
        }
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error(
        error?.response?.data?.message || "Failed to save collection banner"
      );
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (banner) => {
    setCurrentBanner(banner);
    
    // Extract the link path from the full URL
    const linkPath = banner.link.split("/").pop();
    
    setFormData({
      title: banner.title,
      link: linkPath,
      category: banner.category?._id || banner.category,
      isActive: banner.isActive,
    });
    setPreviewUrl(banner.image);
    setEditMode(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this collection banner?"))
      return;

    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_API}/productcollectionbanner/deleteproductcollectionbanner/${id}`
      );

      if (res.data.success) {
        toast.success("Collection banner deleted successfully!");
        fetchAllBanners();
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(
        error?.response?.data?.message || "Failed to delete collection banner"
      );
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditMode(false);
    setCurrentBanner(null);
    setSelectedFile(null);
    setPreviewUrl("");
    setFormData({ title: "", link: "", category: "", isActive: true });
  };

  const getCollectionColor = (title) => {
    const collection = collectionTypes.find((c) => c.value === title);
    return collection?.color || "gray";
  };

  const filteredBanners =
    selectedCollection === "all"
      ? banners
      : banners.filter((b) => b.title === selectedCollection);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 font-medium">Loading collection banners...</p>
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
            Collection Banners
          </h1>
          <p className="text-gray-600 mt-1">
            Manage banners for product collections ({banners.length} total)
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
          <span>Add Banner</span>
        </button>
      </div>

      {/* Collection Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {collectionTypes.map((collection) => {
          const count = banners.filter((b) => b.title === collection.value)
            .length;
          const isSelected = selectedCollection === collection.value;
          return (
            <button
              key={collection.value}
              onClick={() =>
                setSelectedCollection(
                  isSelected ? "all" : collection.value
                )
              }
              className={`p-4 rounded-lg border-2 transition-all ${
                isSelected
                  ? `border-${collection.color}-500 bg-${collection.color}-50 shadow-md`
                  : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
              }`}
            >
              <p className="text-xs font-semibold text-gray-600 mb-1 truncate">
                {collection.label}
              </p>
              <p className="text-2xl font-bold text-gray-900">{count}</p>
            </button>
          );
        })}
      </div>

      {/* Filter Section */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={selectedCollection}
            onChange={(e) => setSelectedCollection(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="all">All Collections</option>
            {collectionTypes.map((collection) => (
              <option key={collection.value} value={collection.value}>
                {collection.label}
              </option>
            ))}
          </select>
          <span className="text-sm text-gray-500 font-medium">
            Showing {filteredBanners.length} of {banners.length} banners
          </span>
        </div>
      </div>

      {/* Banners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredBanners.length > 0 ? (
          filteredBanners.map((banner) => {
            const color = getCollectionColor(banner.title);
            return (
              <div
                key={banner._id}
                className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden group hover:shadow-xl transition-all duration-300"
              >
                <div className="relative">
                  {/* Status & Collection Badges */}
                  <div className="absolute top-3 left-3 z-10 flex gap-2">
                    <span
                      className={`px-3 py-1 bg-${color}-600 text-white text-xs font-bold rounded-full shadow-lg`}
                    >
                      {banner.title}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3 z-10">
                    {banner.isActive ? (
                      <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        Active
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1">
                        <EyeOff className="w-3 h-3" />
                        Inactive
                      </span>
                    )}
                  </div>

                  <img
                    src={banner.image}
                    alt={banner.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button
                      onClick={() => handleEdit(banner)}
                      className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 transition shadow-lg hover:scale-110 transform"
                      title="Edit Banner"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(banner._id)}
                      className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transition shadow-lg hover:scale-110 transform"
                      title="Delete Banner"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Banner Info */}
                <div className="p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-700">
                      {banner.category?.name || "No Category"}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <LinkIcon className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                    <a
                      href={banner.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline break-all line-clamp-2"
                      title={banner.link}
                    >
                      {banner.link}
                    </a>
                  </div>
                  <p className="text-xs text-gray-500">
                    Added: {new Date(banner.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full">
            <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
              <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No collection banners found
              </h3>
              <p className="text-gray-600 mb-4">
                {selectedCollection === "all"
                  ? "Start by adding banners for your product collections"
                  : `No banners found for ${selectedCollection}`}
              </p>
              <button
                onClick={() => {
                  setFormData({ ...formData, title: selectedCollection === "all" ? "" : selectedCollection });
                  setShowModal(true);
                }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition"
              >
                <Plus className="w-5 h-5 inline-block mr-2" />
                Add Banner
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {editMode ? "Edit Collection Banner" : "Add Collection Banner"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* File Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Banner Image{" "}
                  {!editMode && <span className="text-red-500">*</span>}
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 transition">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="banner-upload"
                  />
                  <label
                    htmlFor="banner-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    {previewUrl ? (
                      <div className="relative w-full">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="w-full h-64 object-cover rounded-xl"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                          <span className="text-white font-medium">
                            Click to change image
                          </span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-12 h-12 text-gray-400 mb-3" />
                        <p className="text-sm text-gray-600 mb-1">
                          Click to upload banner image
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG up to 5MB
                        </p>
                      </>
                    )}
                  </label>
                </div>
              </div>

              {/* Collection Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Collection Type <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Collection Type</option>
                    {collectionTypes.map((collection) => (
                      <option key={collection.value} value={collection.value}>
                        {collection.label}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Choose which product collection this banner belongs to
                </p>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Layers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Link Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Link <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={formData.link}
                    onChange={(e) =>
                      setFormData({ ...formData, link: e.target.value })
                    }
                    placeholder="e.g., men-tshirts or product-12345"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Enter the path (backend will add the base URL automatically)
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
                  Set as Active Banner
                </label>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
                  disabled={uploading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {uploading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      {editMode ? "Updating..." : "Adding..."}
                    </span>
                  ) : (
                    <>{editMode ? "Update Banner" : "Add Banner"}</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectionBannersManagement;
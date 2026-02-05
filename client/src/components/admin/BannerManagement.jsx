"use client";
import React, { useState, useEffect } from "react";
import { Upload, Trash2, Plus, X, Image as ImageIcon, Link as LinkIcon, Edit } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

const BannerManagement = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [formData, setFormData] = useState({
    link: "",
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API}/banner/getallbanner`
      );
      setBanners(res?.data?.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching banners:", error);
      toast.error("Failed to load banners");
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

    if (!formData.link.trim()) {
      toast.error("Please enter a link URL");
      return;
    }

    setUploading(true);

    try {
      const formDataToSend = new FormData();
      
      if (selectedFile) {
        formDataToSend.append("banner", selectedFile); // ✅ Field name is 'banner'
      }
      formDataToSend.append("link", formData.link);

      if (editMode && currentBanner) {
        // Update banner
        const res = await axios.patch(
          `${process.env.NEXT_PUBLIC_API}/banner/updatebanner/${currentBanner._id}`,
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (res.data.success) {
          toast.success("Banner updated successfully!");
          fetchBanners();
          handleCloseModal();
        }
      } else {
        // Add new banner
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API}/banner/addbanner`,
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (res.data.success) {
          toast.success("Banner uploaded successfully!");
          fetchBanners();
          handleCloseModal();
        }
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error(error?.response?.data?.message || "Operation failed");
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (banner) => {
    setCurrentBanner(banner);
    setFormData({
      link: banner.link,
    });
    setPreviewUrl(banner.image);
    setEditMode(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;

    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_API}/banner/deletebanner/${id}`
      );

      if (res.data.success) {
        toast.success("Banner deleted successfully!");
        fetchBanners();
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete banner");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditMode(false);
    setCurrentBanner(null);
    setSelectedFile(null);
    setPreviewUrl("");
    setFormData({ link: "" });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Banner Management
          </h1>
          <p className="text-gray-600 mt-1">
            Upload and manage hero banners ({banners.length} banners)
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition"
        >
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline">Add Banner</span>
        </button>
      </div>

      {/* Banners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {banners.length > 0 ? (
          banners.map((banner) => (
            <div
              key={banner._id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group"
            >
              <div className="relative">
                <img
                  src={banner.image}
                  alt="Banner"
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button
                    onClick={() => handleEdit(banner)}
                    className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 transition shadow-lg"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(banner._id)}
                    className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transition shadow-lg"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <LinkIcon className="w-4 h-4 text-gray-400" />
                  <a
                    href={banner.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline truncate"
                  >
                    {banner.link}
                  </a>
                </div>
                <p className="text-xs text-gray-500">
                  Uploaded: {new Date(banner.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full">
            <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
              <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No banners uploaded
              </h3>
              <p className="text-gray-600 mb-4">
                Get started by uploading your first banner
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition"
              >
                Upload Banner
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Upload/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {editMode ? "Edit Banner" : "Upload New Banner"}
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
                  Banner Image {!editMode && <span className="text-red-500">*</span>}
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
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG up to 5MB (Recommended: 1920x600px)
                        </p>
                      </>
                    )}
                  </label>
                </div>
              </div>

              {/* Link Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Banner Link <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="url"
                    value={formData.link}
                    onChange={(e) =>
                      setFormData({ ...formData, link: e.target.value })
                    }
                    placeholder="https://example.com/product"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  URL where users will be redirected when clicking the banner
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  disabled={uploading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      {editMode ? "Updating..." : "Uploading..."}
                    </span>
                  ) : (
                    <>{editMode ? "Update Banner" : "Upload Banner"}</>
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

export default BannerManagement;
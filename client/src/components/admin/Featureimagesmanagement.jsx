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
  Type,
  Grid,
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

const FeatureImagesManagement = () => {
  const [featureImages, setFeatureImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    link: "",
  });

  // Sections for organizing feature images
  const sections = [
    { name: "First 6 Images", range: "1-6", start: 0, count: 6 },
    { name: "Next 3 Images", range: "7-9", start: 6, count: 3 },
    { name: "Next 6 Images", range: "10-15", start: 9, count: 6 },
    { name: "Accessories (3)", range: "16-18", start: 15, count: 3 },
    { name: "Kids (3)", range: "19-21", start: 18, count: 3 },
  ];

  useEffect(() => {
    fetchAllFeatureImages();
  }, []);

  const fetchAllFeatureImages = async () => {
    try {
      // Fetch ALL feature images by calling all endpoints
      const [first6, next3, next6, accessories, kids] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_API}/featureimg/getallfeatureimg`),
        axios.get(`${process.env.NEXT_PUBLIC_API}/featureimg/getnextThreefeatureimg`),
        axios.get(`${process.env.NEXT_PUBLIC_API}/featureimg/getnextsixfeatureimg`),
        axios.get(`${process.env.NEXT_PUBLIC_API}/featureimg/getaccessoriesfeatureimg`),
        axios.get(`${process.env.NEXT_PUBLIC_API}/featureimg/getkidsfeatureimg`),
      ]);

      // Combine all images in order
      const allImages = [
        ...(first6?.data?.data || []),
        ...(next3?.data?.data || []),
        ...(next6?.data?.data || []),
        ...(accessories?.data?.data || []),
        ...(kids?.data?.data || []),
      ];

      setFeatureImages(allImages);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching feature images:", error);
      toast.error("Failed to load feature images");
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
      toast.error("Please select an image");
      return;
    }

    if (!formData.title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    if (!formData.link.trim()) {
      toast.error("Please enter a link");
      return;
    }

    setUploading(true);

    try {
      const formDataToSend = new FormData();
      
      if (selectedFile) {
        formDataToSend.append("featureimg", selectedFile);
      }
      formDataToSend.append("title", formData.title);
      formDataToSend.append("link", formData.link);

      if (editMode && currentImage) {
        // Update feature image
        const res = await axios.patch(
          `${process.env.NEXT_PUBLIC_API}/featureimg/updatefeatureimg/${currentImage._id}`,
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (res.data.success) {
          toast.success("Feature image updated successfully!");
          fetchAllFeatureImages();
          handleCloseModal();
        }
      } else {
        // Add new feature image
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API}/featureimg/addfeatureimg`,
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (res.data.success) {
          toast.success("Feature image added successfully!");
          fetchAllFeatureImages();
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

  const handleEdit = (image) => {
    setCurrentImage(image);
    // Extract just the path from the full link
    const linkPath = image.link.split('/').pop();
    setFormData({
      title: image.title,
      link: linkPath,
    });
    setPreviewUrl(image.image);
    setEditMode(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this feature image?")) return;

    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_API}/featureimg/deletefeatureimg/${id}`
      );

      if (res.data.success) {
        toast.success("Feature image deleted successfully!");
        fetchAllFeatureImages();
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete feature image");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditMode(false);
    setCurrentImage(null);
    setSelectedFile(null);
    setPreviewUrl("");
    setFormData({ title: "", link: "" });
  };

  const getPositionInfo = (index) => {
    let section = "";
    if (index < 6) section = "First 6";
    else if (index < 9) section = "Next 3";
    else if (index < 15) section = "Next 6";
    else if (index < 18) section = "Accessories";
    else section = "Kids";
    
    return { section, position: index + 1 };
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
            Feature Images
          </h1>
          <p className="text-gray-600 mt-1">
            Manage feature images for different sections ({featureImages.length} images)
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition"
        >
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline">Add Feature Image</span>
        </button>
      </div>

      {/* Section Info Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {sections.map((section, idx) => {
          const count = featureImages.filter((_, index) => 
            index >= section.start && index < section.start + section.count
          ).length;
          
          return (
            <div
              key={idx}
              className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-100"
            >
              <div className="flex items-center gap-2 mb-2">
                <Grid className="w-4 h-4 text-blue-600" />
                <p className="text-xs font-semibold text-blue-600">
                  {section.range}
                </p>
              </div>
              <p className="text-sm font-medium text-gray-900">{section.name}</p>
              <p className="text-xs text-gray-600 mt-1">
                {count} / {section.count} images
              </p>
            </div>
          );
        })}
      </div>

      {/* Feature Images Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {featureImages.length > 0 ? (
          featureImages.map((image, index) => {
            const { section, position } = getPositionInfo(index);
            
            return (
              <div
                key={image._id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group"
              >
                {/* Position Badge */}
                <div className="relative">
                  <div className="absolute top-3 left-3 z-10">
                    <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full shadow-lg">
                      #{position}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3 z-10">
                    <span className="px-3 py-1 bg-purple-600 text-white text-xs font-bold rounded-full shadow-lg">
                      {section}
                    </span>
                  </div>

                  <img
                    src={image.image}
                    alt={image.title}
                    className="w-full h-48 object-cover"
                  />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button
                      onClick={() => handleEdit(image)}
                      className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 transition shadow-lg"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(image._id)}
                      className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transition shadow-lg"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Image Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 truncate">
                    {image.title}
                  </h3>
                  <div className="flex items-center gap-2 mb-2">
                    <LinkIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <a
                      href={image.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline truncate"
                      title={image.link}
                    >
                      {image.link}
                    </a>
                  </div>
                  <p className="text-xs text-gray-500">
                    Added: {new Date(image.createdAt).toLocaleDateString()}
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
                No feature images
              </h3>
              <p className="text-gray-600 mb-4">
                Start by adding your first feature image
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition"
              >
                Add Feature Image
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Info Alert */}
      {featureImages.length < 21 && featureImages.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Grid className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">Images are displayed in order</p>
              <p>
                Images 1-6 → Homepage First Section<br />
                Images 7-9 → Second Section<br />
                Images 10-15 → Third Section<br />
                Images 16-18 → Accessories Section<br />
                Images 19-21 → Kids Section
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {editMode ? "Edit Feature Image" : "Add Feature Image"}
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
                  Feature Image {!editMode && <span className="text-red-500">*</span>}
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 transition">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="feature-upload"
                  />
                  <label
                    htmlFor="feature-upload"
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
                          Click to upload image
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG up to 5MB (Recommended: 800x600px)
                        </p>
                      </>
                    )}
                  </label>
                </div>
              </div>

              {/* Title Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Type className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="e.g., Summer Collection, New Arrivals"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
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
                    placeholder="product-category or product-id"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Backend will prepend base URL to this path
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
                      {editMode ? "Updating..." : "Adding..."}
                    </span>
                  ) : (
                    <>{editMode ? "Update Image" : "Add Image"}</>
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

export default FeatureImagesManagement;
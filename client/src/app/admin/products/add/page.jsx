"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  Image as ImageIcon,
  ArrowLeft,
  Trash2,
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

const AddProduct = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [showVariantModal, setShowVariantModal] = useState(false);
  const [variants, setVariants] = useState([]);
  const [currentVariant, setCurrentVariant] = useState({
    size: "",
    color: "",
    stock: "",
  });

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "0",
    originalPrice: "0",
    category: "",
    subcategory: "",
    stock: "0",
    productType: "men",
    variantType: "SingleVarient",
    isNew: false,
    isFeatured: false,
    rating: "0",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (formData.category) {
      fetchSubcategories(formData.category);
    } else {
      setSubcategories([]);
    }
  }, [formData.category]);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API}/category/getallcategory`
      );
      setCategories(res?.data?.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchSubcategories = async (categoryId) => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API}/subcategory/getallsubcategory`
      );
      const filtered = res?.data?.data?.filter(
        (sub) => sub.category === categoryId
      );
      setSubcategories(filtered || []);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);

    if (files.length + selectedImages.length > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }

    const validFiles = [];
    files.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is larger than 5MB`);
        return;
      }

      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image`);
        return;
      }

      validFiles.push(file);
    });

    if (validFiles.length > 0) {
      setSelectedImages([...selectedImages, ...validFiles]);
      const newPreviewUrls = validFiles.map((file) =>
        URL.createObjectURL(file)
      );
      setPreviewUrls([...previewUrls, ...newPreviewUrls]);
    }
  };

  const removeImage = (index) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    const newPreviews = previewUrls.filter((_, i) => i !== index);
    setSelectedImages(newImages);
    setPreviewUrls(newPreviews);
  };

  // Variant Functions
  const handleAddVariant = () => {
    if (!currentVariant.stock || currentVariant.stock <= 0) {
      toast.error("Stock is required and must be greater than 0");
      return;
    }

    setVariants([...variants, { ...currentVariant }]);
    setCurrentVariant({ size: "", color: "", stock: "" });
    toast.success("Variant added");
  };

  const handleRemoveVariant = (index) => {
    setVariants(variants.filter((_, i) => i !== index));
    toast.success("Variant removed");
  };

  const handleVariantTypeChange = (value) => {
    setFormData({ ...formData, variantType: value });
    if (value === "MultiVarient") {
      setShowVariantModal(true);
    } else {
      setVariants([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (selectedImages.length === 0) {
      toast.error("Please select at least one product image");
      return;
    }

    if (!formData.title.trim()) {
      toast.error("Product title is required");
      return;
    }

    if (!formData.description.trim()) {
      toast.error("Product description is required");
      return;
    }

    if (!formData.category) {
      toast.error("Please select a category");
      return;
    }

    if (!formData.stock || formData.stock <= 0) {
      toast.error("Please enter valid stock quantity (greater than 0)");
      return;
    }

    if (formData.variantType === "MultiVarient" && variants.length === 0) {
      toast.error("Please add at least one variant for multi-variant product");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const parsedToken = token ? JSON.parse(token) : null;

      if (!parsedToken) {
        toast.error("Please login first");
        router.push("/login");
        return;
      }

      // Create FormData
      const formDataToSend = new FormData();

      // Append images - IMPORTANT: Must match backend field name
      selectedImages.forEach((image) => {
        formDataToSend.append("product", image);
      });

      // Append ALL required fields as per backend validation
      formDataToSend.append("title", formData.title.trim());
      formDataToSend.append("description", formData.description.trim());
      formDataToSend.append("category", formData.category);
      formDataToSend.append("stock", formData.stock);
      formDataToSend.append("productType", formData.productType);
     
      
      // Optional fields
      formDataToSend.append("price", formData.price || "0");
      formDataToSend.append("originalPrice", formData.originalPrice || "0");
      formDataToSend.append("rating", "0");
      formDataToSend.append("isNew", formData.isNew);
      formDataToSend.append("isFeatured", formData.isFeatured);

      // Subcategory (optional)
      if (formData.subcategory) {
        formDataToSend.append("subcategory", formData.subcategory);
      }

      // Arrays - send as empty arrays initially
    
      formDataToSend.append("variants", JSON.stringify([]));

      console.log("=== Sending Product Data ===");
      console.log("Title:", formData.title);
      console.log("Images count:", selectedImages.length);
      console.log("Category:", formData.category);
      console.log("Stock:", formData.stock);
      console.log("Product Type:", formData.productType);
      console.log("Variant Type:", formData.variantType);

      // Step 1: Create Product
      const productRes = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/products/addproduct`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${parsedToken}`,
          },
        }
      );

      console.log("Product created:", productRes.data);

      if (!productRes.data.success) {
        throw new Error(productRes.data.message || "Failed to add product");
      }

      const productId = productRes.data.data._id;

      // Step 2: Add Variants if MultiVarient
      if (formData.variantType === "MultiVarient" && variants.length > 0) {
        console.log("Adding variants...");
        for (const variant of variants) {
          await axios.post(
            `${process.env.NEXT_PUBLIC_API}/variant/addvariant`,
            {
              product: productId,
              size: variant.size || "",
              color: variant.color || "",
              stock: parseInt(variant.stock),
            },
            {
              headers: {
                Authorization: `Bearer ${parsedToken}`,
              },
            }
          );
        }
        console.log("Variants added successfully");
      }

      toast.success("Product added successfully!");
      router.push("/admin/products");
    } catch (error) {
      console.error("=== Error Adding Product ===");
      console.error("Error:", error);
      console.error("Response:", error?.response?.data);
      
      const errorMessage = 
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to add product";
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Add New Product
          </h1>
          <p className="text-gray-600 mt-1">
            Fill in the details to add a new product
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Images */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
              <h3 className="text-lg font-semibold mb-4">
                Product Images <span className="text-red-500">*</span>
              </h3>

              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-500 transition mb-4">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageSelect}
                  className="hidden"
                  id="product-images"
                />
                <label
                  htmlFor="product-images"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <ImageIcon className="w-12 h-12 text-gray-400 mb-3" />
                  <p className="text-sm text-gray-600 mb-1">
                    Click to upload images
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG up to 5MB (Max 5 images)
                  </p>
                </label>
              </div>

              {previewUrls.length > 0 && (
                <div className="grid grid-cols-2 gap-3">
                  {previewUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      {index === 0 && (
                        <div className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                          Main
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <p className="text-xs text-gray-500 mt-3">
                {selectedImages.length}/5 images
              </p>
            </div>
          </div>

          {/* Right Column - Form Fields */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">
                Basic Information
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="Enter product title"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows="4"
                    placeholder="Enter product description"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Pricing & Stock */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Pricing & Stock</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (৳)
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    placeholder="0"
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Original Price (৳)
                  </label>
                  <input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        originalPrice: e.target.value,
                      })
                    }
                    placeholder="0"
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({ ...formData, stock: e.target.value })
                    }
                    placeholder="0"
                    min="1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Categories</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value,
                        subcategory: "",
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subcategory
                  </label>
                  <select
                    value={formData.subcategory}
                    onChange={(e) =>
                      setFormData({ ...formData, subcategory: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={!formData.category}
                  >
                    <option value="">Select Subcategory (Optional)</option>
                    {subcategories.map((sub) => (
                      <option key={sub._id} value={sub._id}>
                        {sub.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.productType}
                    onChange={(e) =>
                      setFormData({ ...formData, productType: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                    <option value="kids">Kids</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Variant Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.variantType}
                    onChange={(e) => handleVariantTypeChange(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="SingleVarient">Single Variant</option>
                    <option value="MultiVarient">Multi Variant</option>
                  </select>
                </div>
              </div>

              {/* Show variants if Multi Variant */}
              {formData.variantType === "MultiVarient" && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-gray-700">
                      Product Variants ({variants.length})
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowVariantModal(true)}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      + Add Variant
                    </button>
                  </div>

                  {variants.length > 0 ? (
                    <div className="space-y-2">
                      {variants.map((variant, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex gap-4 text-sm">
                            {variant.size && (
                              <span>
                                Size: <strong>{variant.size}</strong>
                              </span>
                            )}
                            {variant.color && (
                              <span>
                                Color: <strong>{variant.color}</strong>
                              </span>
                            )}
                            <span>
                              Stock: <strong>{variant.stock}</strong>
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveVariant(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">
                      No variants added yet. Click "+ Add Variant" to add one.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Additional Options */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">
                Additional Options
              </h3>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isNew"
                    checked={formData.isNew}
                    onChange={(e) =>
                      setFormData({ ...formData, isNew: e.target.checked })
                    }
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="isNew"
                    className="text-sm font-medium text-gray-700"
                  >
                    Mark as New Arrival
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isFeatured: e.target.checked,
                      })
                    }
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="isFeatured"
                    className="text-sm font-medium text-gray-700"
                  >
                    Mark as Featured Product
                  </label>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Adding Product...
                  </span>
                ) : (
                  "Add Product"
                )}
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Variant Modal */}
      {showVariantModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Add Product Variant
              </h2>
              <button
                onClick={() => setShowVariantModal(false)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Size (e.g., S, M, L, XL, 38, 40)
                </label>
                <input
                  type="text"
                  value={currentVariant.size}
                  onChange={(e) =>
                    setCurrentVariant({
                      ...currentVariant,
                      size: e.target.value,
                    })
                  }
                  placeholder="Enter size"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color (e.g., Red, Blue, Black)
                </label>
                <input
                  type="text"
                  value={currentVariant.color}
                  onChange={(e) =>
                    setCurrentVariant({
                      ...currentVariant,
                      color: e.target.value,
                    })
                  }
                  placeholder="Enter color"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={currentVariant.stock}
                  onChange={(e) =>
                    setCurrentVariant({
                      ...currentVariant,
                      stock: e.target.value,
                    })
                  }
                  placeholder="0"
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowVariantModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleAddVariant();
                    setShowVariantModal(false);
                  }}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition"
                >
                  Add Variant
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddProduct;
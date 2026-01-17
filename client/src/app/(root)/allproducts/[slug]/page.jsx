"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import Container from "@/components/common/Container";
import {
  Heart,
  ShoppingCart,
  Truck,
  Shield,
  RefreshCw,
  Star,
  Plus,
  Minus,
} from "lucide-react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import Products from "@/components/common/Products";

const Page = () => {
  const router = useRouter();
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingSimilar, setLoadingSimilar] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  const user = useSelector((state) => state.user?.value);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${process.env.NEXT_PUBLIC_API}/products/productslug/${slug}`)
      .then((res) => {
        const p = res?.data?.data ?? null;
        setProduct(p);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Product Load Error:", err);
        setProduct(null);
        setLoading(false);
      });
  }, [slug]);

  // Fetch similar products
  useEffect(() => {
    setLoadingSimilar(true);
    axios
      .get(`${process.env.NEXT_PUBLIC_API}/products/similarproducts/${slug}`)
      .then((res) => {
        setSimilarProducts(res?.data?.data ?? []);
        setLoadingSimilar(false);
      })
      .catch((err) => {
        console.error("Similar Products Load Error:", err);
        setSimilarProducts([]);
        setLoadingSimilar(false);
      });
  }, [slug]);

  // images
  const images = product?.images || product?.image || ["/placeholder.jpg"];
  const imagesArray = Array.isArray(images) ? images : [images];

  // variants -> derive sizes/colors
  const variantList = Array.isArray(product?.variants) ? product.variants : [];
  const sizesFromVariants = Array.from(
    new Set(variantList.map((v) => v.size).filter(Boolean))
  );
  const colorsFromVariants = Array.from(
    new Set(variantList.map((v) => v.color).filter(Boolean))
  );

  const sizes =
    Array.isArray(product?.sizes) && product.sizes.length > 0
      ? product.sizes
      : sizesFromVariants;
  const colors =
    Array.isArray(product?.colors) && product.colors.length > 0
      ? product.colors
      : colorsFromVariants;

  useEffect(() => {
    if (!product) return;
    if (!selectedSize && sizes.length > 0) setSelectedSize(sizes[0]);
    if (!selectedColor && colors.length > 0) setSelectedColor(colors[0]);
    setSelectedImage(0);
    setQuantity(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

  // find variant (flexible matching)
  const selectedVariant =
    variantList.find((v) => {
      const sizeExists =
        sizesFromVariants.length > 0 ||
        (Array.isArray(product?.sizes) && product.sizes.length > 0);
      const colorExists =
        colorsFromVariants.length > 0 ||
        (Array.isArray(product?.colors) && product.colors.length > 0);

      const sizeMatches =
        !sizeExists || !selectedSize ? true : v.size === selectedSize;
      const colorMatches =
        !colorExists || !selectedColor ? true : v.color === selectedColor;

      return sizeMatches && colorMatches;
    }) ?? null;

  const availableStock =
    product?.variantType === "MultiVarient"
      ? selectedVariant?.stock ?? 0
      : product?.stock ?? product?.totalStock ?? 0;

  const getUserId = () => {
    return user?.id || user?._id || null;
  };

  const handleAddToCart = async () => {
    const userId = getUserId();
    if (!userId) {
      toast.info("Please login to add items to cart.");
      router.push("/login");
      return;
    }

    // MULTI-VARIANT PRODUCT
    if (product?.variantType === "MultiVarient") {
      // only require selections that actually exist
      if (sizes.length > 0 && !selectedSize) {
        alert("Please select a size");
        return;
      }
      if (colors.length > 0 && !selectedColor) {
        alert("Please select a color");
        return;
      }

      if (!selectedVariant) {
        alert("Selected variant is not available");
        return;
      }

      if (selectedVariant.stock < quantity) {
        alert(`Only ${selectedVariant.stock} items available for this variant`);
        return;
      }

      const payload = {
        user: userId,
        product: product._id,
        quantity,
        variants: selectedVariant._id,
      };

      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API}/cart/addtocart`,
          payload
        );

        if (res?.status === 200 || res?.status === 201) {
          toast.success("Item added to cart successfully!");
        } else {
          console.warn("Add to cart response:", res);
          toast.error("Failed to add item to cart.");
        }
      } catch (err) {
        console.error("Add to cart error (multi):", err);
        const backendMessage =
          err?.response?.data?.error || err?.response?.data?.message || null;
        toast.error(
          backendMessage
            ? `Failed: ${backendMessage}`
            : "Failed to add item to cart."
        );
      }

      return;
    }

    // SINGLE VARIANT / SIMPLE PRODUCT
    if (availableStock < quantity) {
      alert(`Only ${availableStock} items available`);
      return;
    }

    try {
      const payload = {
        user: userId,
        product: product._id,
        quantity,
      };
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/cart/addtocart`,
        payload
      );
      if (res?.status === 200 || res?.status === 201) {
        toast.success("Item added to cart successfully!");
      } else {
        console.warn("Add to cart response (single):", res);
        toast.error("Failed to add item to cart.");
      }
    } catch (err) {
      console.error("Add to cart error (single):", err);
      const backendMessage =
        err?.response?.data?.error || err?.response?.data?.message || null;
      toast.error(
        backendMessage
          ? `Failed: ${backendMessage}`
          : "Failed to add item to cart."
      );
    }
  };

  const handleAddToWishlist = () => {
    console.log("Add to wishlist:", product);
  };

  const incrementQuantity = () => {
    if (quantity < availableStock) setQuantity((q) => q + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) setQuantity((q) => q - 1);
  };

  if (loading) {
    return (
      <section className="py-6 sm:py-8 md:py-12 bg-gray-50">
        <Container>
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
              <div className="bg-gray-300 h-64 sm:h-80 md:h-96 rounded-lg"></div>
              <div className="space-y-3 sm:space-y-4">
                <div className="bg-gray-300 h-6 sm:h-8 w-3/4 rounded"></div>
                <div className="bg-gray-300 h-4 sm:h-6 w-1/2 rounded"></div>
                <div className="bg-gray-300 h-24 sm:h-32 rounded"></div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="py-8 sm:py-12">
        <Container>
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Product not found
            </h2>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-6 sm:py-8 md:py-12 bg-gray-50">
      <Container>
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-4 md:p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:gap-12">
            {/* Left - Images */}
            <div className="space-y-3 sm:space-y-4">
              <div className="relative overflow-hidden rounded-lg sm:rounded-xl bg-gray-100 aspect-square">
                <img
                  src={imagesArray[selectedImage]}
                  alt={product?.title || product?.name}
                  className="w-full h-full object-cover"
                />
                {product?.discount && (
                  <div className="absolute top-2 sm:top-3 md:top-4 left-2 sm:left-3 md:left-4 bg-red-500 text-white text-xs sm:text-sm font-bold px-2 sm:px-3 md:px-4 py-1 sm:py-2 rounded-full">
                    -{product.discount}% OFF
                  </div>
                )}
              </div>

              {imagesArray.length > 1 && (
                <div className="grid grid-cols-4 gap-2 sm:gap-3">
                  {imagesArray.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative overflow-hidden rounded-md sm:rounded-lg aspect-square border-2 transition-all ${
                        selectedImage === index
                          ? "border-blue-600 ring-2 ring-blue-200"
                          : "border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Product ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right - Product Info */}
            <div className="space-y-4 sm:space-y-5 md:space-y-6">
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">
                  {product?.title || product?.name}
                </h1>

                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <div className="flex items-center gap-1">
                    <div className="flex text-yellow-400 text-sm sm:text-base md:text-lg">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 sm:w-5 sm:h-5 ${
                            i < Math.floor(product?.rating || 4)
                              ? "fill-yellow-400"
                              : "fill-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs sm:text-sm text-gray-600 ml-1 sm:ml-2">
                      {product?.rating || 4.5} ({product?.reviews || 128}{" "}
                      reviews)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                    ৳{product?.price ?? "0.00"}
                  </span>
                  {product?.originalPrice && (
                    <span className="text-base sm:text-lg md:text-xl text-gray-500 line-through">
                      ৳{product.originalPrice}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                      availableStock > 0
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {availableStock > 0
                      ? product?.variantType === "MultiVarient" &&
                        (selectedSize || selectedColor)
                        ? `In Stock (${availableStock} available)`
                        : `In Stock (${product?.stock ?? availableStock})`
                      : "Out of Stock"}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 sm:pt-5 md:pt-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                  Description
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  {product?.description 
                    ? product.description.split('\n\n').map((paragraph, index) => (
                        <p key={index} className="text-sm sm:text-base text-gray-600 leading-relaxed">
                          {paragraph}
                        </p>
                      ))
                    : <p className="text-sm sm:text-base text-gray-600 leading-relaxed">High-quality product...</p>
                  }
                </div>
              </div>

              {/* Size */}
              {product?.variantType === "MultiVarient" && sizes.length > 0 && (
                <div>
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-3">
                    Select Size <span className="text-red-500">*</span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((size) => {
                      const sizeHasStock = variantList.some(
                        (v) => v.size === size && v.stock > 0
                      );
                      return (
                        <button
                          key={size}
                          onClick={() => {
                            setSelectedSize(size);
                            setQuantity(1);
                          }}
                          disabled={!sizeHasStock}
                          className={`px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 rounded-lg border-2 text-xs sm:text-sm md:text-base font-medium transition-all ${
                            selectedSize === size
                              ? "border-blue-600 bg-blue-50 text-blue-600"
                              : sizeHasStock
                              ? "border-gray-300 hover:border-gray-400 text-gray-700"
                              : "border-gray-200 text-gray-400 cursor-not-allowed opacity-50"
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Color */}
              {product?.variantType === "MultiVarient" && colors.length > 0 && (
                <div>
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-3">
                    Select Color <span className="text-red-500">*</span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((color) => {
                      const colorHasStock = variantList.some(
                        (v) =>
                          v.color === color &&
                          v.stock > 0 &&
                          (!selectedSize || v.size === selectedSize)
                      );
                      return (
                        <button
                          key={color}
                          onClick={() => {
                            setSelectedColor(color);
                            setQuantity(1);
                          }}
                          disabled={!colorHasStock}
                          className={`px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 rounded-lg border-2 text-xs sm:text-sm md:text-base font-medium transition-all ${
                            selectedColor === color
                              ? "border-blue-600 bg-blue-50 text-blue-600"
                              : colorHasStock
                              ? "border-gray-300 hover:border-gray-400 text-gray-700"
                              : "border-gray-200 text-gray-400 cursor-not-allowed opacity-50"
                          }`}
                        >
                          {color}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div>
                <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-3">
                  Quantity
                </h3>
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="flex items-center border-2 border-gray-300 rounded-lg">
                    <button
                      onClick={decrementQuantity}
                      className="p-2 sm:p-3 hover:bg-gray-100 transition-colors"
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                    <span className="px-4 sm:px-6 py-1.5 sm:py-2 font-semibold text-base sm:text-lg">
                      {quantity}
                    </span>
                    <button
                      onClick={incrementQuantity}
                      className="p-2 sm:p-3 hover:bg-gray-100 transition-colors"
                      disabled={quantity >= availableStock}
                    >
                      <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                  <span className="text-xs sm:text-sm text-gray-600">
                    {availableStock} pieces available
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 sm:gap-3 pt-3 sm:pt-4">
                <button
                  onClick={handleAddToCart}
                  disabled={availableStock <= 0}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" /> Add to Cart
                </button>
                <button
                  onClick={handleAddToWishlist}
                  className="bg-gray-100 text-gray-900 font-semibold p-3 sm:p-4 rounded-lg sm:rounded-xl hover:bg-red-50 hover:text-red-600 transition-all duration-300 transform hover:scale-105"
                >
                  <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>

              {/* Variant warning */}
              {product?.variantType === "MultiVarient" &&
                ((sizes.length > 0 && !selectedSize) ||
                  (colors.length > 0 && !selectedColor)) && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 sm:p-3">
                    <p className="text-xs sm:text-sm text-yellow-800">
                      Please select{" "}
                      {sizes.length > 0 && !selectedSize && "size"}
                      {sizes.length > 0 &&
                        !selectedSize &&
                        colors.length > 0 &&
                        !selectedColor &&
                        " and "}
                      {colors.length > 0 && !selectedColor && "color"} before
                      adding to cart
                    </p>
                  </div>
                )}

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="bg-blue-100 p-2 sm:p-3 rounded-lg">
                    <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-gray-900">
                      Free Shipping
                    </p>
                    <p className="text-[10px] sm:text-xs text-gray-600">On orders over $50</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="bg-green-100 p-2 sm:p-3 rounded-lg">
                    <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-gray-900">
                      Secure Payment
                    </p>
                    <p className="text-[10px] sm:text-xs text-gray-600">100% secure</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="bg-purple-100 p-2 sm:p-3 rounded-lg">
                    <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-gray-900">
                      Easy Returns
                    </p>
                    <p className="text-[10px] sm:text-xs text-gray-600">30-day return</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional details */}
          <div className="mt-8 sm:mt-10 md:mt-12 pt-6 sm:pt-8 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
                  Product Details
                </h3>
                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">SKU:</span>
                    <span className="font-medium text-gray-900">
                      {product?.sku ||
                        "PG-" + (product?._id?.slice(-6) ?? "000000")}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium text-gray-900">
                      {product?.category || "Fashion"}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Brand:</span>
                    <span className="font-medium text-gray-900">
                      {product?.brand || "Pick & Go"}
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Availability:</span>
                    <span
                      className={`font-medium ${
                        availableStock > 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {availableStock > 0 ? "In Stock" : "Out of Stock"}
                    </span>
                  </div>
                  {product?.variantType === "MultiVarient" && (
                    <div className="flex justify-between py-2 border-t border-gray-100 pt-2">
                      <span className="text-gray-600">Variant Type:</span>
                      <span className="font-medium text-gray-900">
                        MultiVarient
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
                  Shipping Information
                </h3>
                <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-600">
                  <p>• Free standard shipping on orders over $50</p>
                  <p>• Express shipping available at checkout</p>
                  <p>• Estimated delivery: 3-7 business days</p>
                  <p>• International shipping available</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Products Section */}
        <div className="mt-10 sm:mt-12 md:mt-16">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
              You May Also Like
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Check out similar products based on your interest
            </p>
          </div>

          {loadingSimilar ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gray-300 rounded-lg h-48 sm:h-64 md:h-80 mb-3 sm:mb-4"></div>
                  <div className="bg-gray-300 h-3 sm:h-4 rounded w-3/4 mb-2"></div>
                  <div className="bg-gray-300 h-3 sm:h-4 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : similarProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {similarProducts.map((item) => (
                <Products product={item} key={item._id} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 sm:py-10 md:py-12 bg-gray-50 rounded-xl">
              <p className="text-sm sm:text-base text-gray-600">No similar products found</p>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
};

export default Page;
"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import { Heart, ShoppingCart, Eye } from 'lucide-react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'


const Products = ({ product }) => {
   const userId = useSelector((state) => state.user.value)
  // ✅ Calculate discount percentage safely
  const discountPercent =
    product?.originalPrice &&
    product?.price &&
    product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) /
            product.originalPrice) *
            100
        )
      : null
  const [wishlistIds, setWishlistIds] = useState([])
       const handleWishlist = (product) => {
  if(!userId) {
    toast.error("Please login to add to wishlist")
    return
  }
  // prevent duplicate add
  if (wishlistIds.includes(product._id)) {
    toast.error("Already in wishlist")
    return
  }

  axios
    .post(`${process.env.NEXT_PUBLIC_API}/wishlist/addtowishlist`, {
      user: userId._id,
      product: product._id,
     
    })
    .then(() => {
      setWishlistIds((prev) => [...prev, product._id])
      toast.success("Product added to wishlist ❤️")
    })
    .catch((err) => {
      console.error(err)
      toast.error("Failed to add to wishlist")
    })
}
 console.log(product._id)

  return (
    <div className="group relative bg-white rounded-lg sm:rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden">
       <Toaster position="top-right" />
      {/* Product Image */}
      <div className="relative overflow-hidden bg-gray-100">
        <Link href={`/allproducts/${product?.slug || product?._id}`}>
          <div className="relative h-40 sm:h-56 md:h-64 lg:h-80 w-full">
            {product?.image?.length ? (
              <img
                src={product.image[0]}
                alt={product?.title || 'Product'}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl">📦</span>
              </div>
            )}
          </div>
        </Link>

        {/* Badges */}
        <div className="absolute top-1.5 sm:top-2 md:top-3 left-1.5 sm:left-2 md:left-3 flex flex-col gap-1 sm:gap-2">
          {discountPercent && (
            <div className="bg-red-500 text-white text-[9px] sm:text-[10px] md:text-xs font-bold px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 rounded-full">
              -{discountPercent}%
            </div>
          )}
          {product?.isNew && (
            <div className="bg-green-500 text-white text-[9px] sm:text-[10px] md:text-xs font-bold px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 rounded-full">
              New
            </div>
          )}
        </div>

        {/* Hover Actions - Hidden on mobile, visible on md+ */}
        <div className="hidden md:flex absolute top-3 right-3 flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button onClick={() => handleWishlist(product)}
            className="bg-white p-2 rounded-full shadow-lg hover:bg-red-500 hover:text-white transition-all duration-300 transform hover:scale-110"
            aria-label="Add to wishlist"
          >
            <Heart className="w-5 h-5" />
          </button>

          <Link
            href={`/product/${product?.slug || product?._id}`}
            className="bg-white p-2 rounded-full shadow-lg hover:bg-blue-500 hover:text-white transition-all duration-300 transform hover:scale-110"
            aria-label="Quick view"
          >
            <Eye className="w-5 h-5" />
          </Link>
        </div>

        {/* Add to Cart / Buy Now */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-1 sm:px-2 py-1 sm:py-2 text-[9px] sm:text-[10px] md:text-[12px] transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <div className="flex gap-1 sm:gap-2">
            <button
              className="flex-1 bg-white text-gray-900 py-1 sm:py-1.5 md:py-2 px-2 sm:px-3 md:px-4 rounded-md sm:rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-all duration-300 flex items-center justify-center gap-1"
            >
              <ShoppingCart className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Add</span>
            </button>

            <Link
              href={`/checkout?product=${product?._id}`}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-1 sm:py-1.5 md:py-2 px-2 sm:px-3 md:px-4 rounded-md sm:rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 text-center"
            >
              Buy Now
            </Link>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-2 sm:p-3 md:p-4">
        <Link href={`/product/${product?.slug || product?._id}`}>
          <h3 className="font-semibold text-xs sm:text-sm md:text-base text-gray-900 mb-1 sm:mb-2 line-clamp-2 hover:text-blue-600 transition-colors leading-tight">
            {product?.title || 'Product Name'}
          </h3>
        </Link>

        {/* Rating */}
        {product?.rating && (
          <div className="flex items-center gap-1 mb-1 sm:mb-2">
            <div className="flex text-yellow-400 text-xs sm:text-sm">
              {[...Array(5)].map((_, i) => (
                <span key={i}>
                  {i < Math.floor(product.rating) ? '★' : '☆'}
                </span>
              ))}
            </div>
            <span className="text-[9px] sm:text-[10px] md:text-xs text-gray-500">
              ({product?.reviews || 0})
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
          <span className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-gray-900">
            ৳{product?.price ?? '0.00'}
          </span>

          {product?.originalPrice &&
            product.originalPrice > product.price && (
              <span className="text-[10px] sm:text-xs md:text-sm text-gray-500 line-through">
                ৳{product.originalPrice}
              </span>
            )}
        </div>

        {/* Stock */}
        {product?.stock !== undefined && (
          <p
            className={`text-[9px] sm:text-[10px] md:text-xs ${
              product.stock > 0 ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {product.stock > 0
              ? `In Stock (${product.stock})`
              : 'Out of Stock'}
          </p>
        )}
      </div>
    </div>
  )
}

export default Products
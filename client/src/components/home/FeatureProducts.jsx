"use client"

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Link from 'next/link'
import { Heart, ShoppingCart, Eye } from 'lucide-react'
import Container from '../common/Container'
import { useSelector } from 'react-redux'
import toast, { Toaster } from 'react-hot-toast'



const FeatureProducts = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [wishlistIds, setWishlistIds] = useState([])

    const userId = useSelector((state) => state.user.value)

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API}/products/featuredproducts`, { cache: 'no-store' })
      .then((res) => {
        setProducts(res?.data?.data ?? [])
        setLoading(false)
      })
      .catch((err) => {
        console.error("Products Load Error:", err)
        setLoading(false)
      })
  }, [])

  const handleAddToCart = (product) => {
    console.log("Add to cart:", product)
  }

 const handleWishlist = (product) => {
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


  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center">
            Loading Products...
          </h2>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <Container>
          <Toaster position="top-right" />
        <div className="max-w-7xl mx-auto px-4">

          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">
              Featured Products
            </h2>
            <p className="text-gray-600 text-lg">
              Check out our handpicked collection
            </p>
          </div>

          {/* Products */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => {

              // ✅ Correct discount calculation PER PRODUCT
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

              return (
                <div
                  key={product._id}
                  className="group relative bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden"
                >
                  {/* Image */}
                  <div className="relative overflow-hidden bg-gray-100">
                    <Link href={`/allproducts/${product?.slug || product?._id}`}>
                      <div className="relative h-80 w-full">
                        {product?.image?.length ? (
                          <img
                            src={product.image[0]}
                            alt={product?.title || 'Product'}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200">
                            📦
                          </div>
                        )}
                      </div>
                    </Link>

                    {/* Discount Badge */}
                    {discountPercent && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        -{discountPercent}%
                      </div>
                    )}

                    {/* New Badge */}
                    {product?.isNew && (
                      <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        New
                      </div>
                    )}

                    {/* Hover Actions */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition">
                    <button
  onClick={() => handleWishlist(product)}
  className={`p-2 rounded-full shadow transition
    ${
      wishlistIds.includes(product._id)
        ? "bg-red-500 text-white"
        : "bg-white hover:bg-red-500 hover:text-white"
    }`}
>
  <Heart size={18} />
</button>

                      <Link
                        href={`/allproducts/${product?.slug || product?._id}`}
                        className="bg-white p-2 rounded-full shadow hover:bg-blue-500 hover:text-white"
                      >
                        <Eye size={18} />
                      </Link>
                    </div>

                    {/* Bottom Actions */}
                     <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-1 py-1 text-[12px] transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <div className="flex gap-2">
            <button
              className="flex-1 bg-white text-gray-900 py-2 px-4 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </button>

            <Link
              href={`/checkout?product=${product?._id}`}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 text-center"
            >
              Buy Now
            </Link>
          </div>
        </div>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="font-semibold mb-2 line-clamp-2">
                      {product?.title}
                    </h3>

                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold">
                        ${product?.price}
                      </span>

                      {product?.originalPrice &&
                        product.originalPrice > product.price && (
                          <span className="text-sm line-through text-gray-400">
                            ${product.originalPrice}
                          </span>
                        )}
                    </div>

                    {product?.stock !== undefined && (
                      <p
                        className={`text-xs mt-2 ${
                          product.stock > 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {product.stock > 0
                          ? `In Stock (${product.stock})`
                          : "Out of Stock"}
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* View All */}
          {products.length > 0 && (
            <div className="text-center mt-12">
              <Link
                href="/allproducts"
                className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:scale-105 transition inline-block"
              >
                View All Products
              </Link>
            </div>
          )}
        </div>
      </Container>
    </section>
  )
}

export default FeatureProducts

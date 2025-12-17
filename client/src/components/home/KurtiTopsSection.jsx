"use client"
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Link from 'next/link'
import Container from '../common/Container'

const KurtiTopsSection = () => {
  const [bannerData, setBannerData] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch banner
    axios
      .get(`${process.env.NEXT_PUBLIC_API}/productCollectionBanner/getkurtitopsbanner`, { cache: 'no-store' })
      .then((res) => {
        setBannerData(res?.data?.data?.[0] || null)
      
      })
      .catch((err) => {
        console.error("Banner Load Error:", err)
      })
   

    // Fetch polo products
    axios
      .get(`${process.env.NEXT_PUBLIC_API}/products/categorypolo/kurti-tunic-and-tops`, { cache: 'no-store' })
      .then((res) => {
        const poloProducts = res?.data?.data ?? []
        // Take first 7 products (6 + 1 for "View More" card)
        setProducts(poloProducts.slice(0, 7))
        setLoading(false)
      })
      .catch((err) => {
        console.error("Products Load Error:", err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <section className="py-8 bg-gray-50">
        <Container>
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-1 bg-gray-300 h-96 rounded-lg"></div>
              <div className="lg:col-span-2">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-gray-300 h-64 rounded-lg"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    )
  }

  return (
    <section className="py-8 bg-gray-50">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Side - Large Banner */}
          <div className="lg:col-span-1">
            {bannerData ? (
              <Link
                href={bannerData?.link || '#'}
                className="group block relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 h-full"
              >
                <div className="relative h-full min-h-[500px] lg:min-h-full">
                  {bannerData?.image ? (
                    <img
                      src={bannerData.image}
                      alt={bannerData?.title || 'Designer Polo'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                      <span className="text-6xl">👕</span>
                    </div>
                  )}

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* Title if exists */}
                  {bannerData?.title && (
                    <div className="absolute -bottom-5 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                      <h3 className="text-white text-2xl text-center font-bold mb-2">
                        {bannerData.title}
                      </h3>
                     
                    </div>
                  )}
                </div>
              </Link>
            ) : (
              <div className="w-full h-full min-h-[500px] bg-gray-200 rounded-xl flex items-center justify-center">
                <p className="text-gray-500">No banner available</p>
              </div>
            )}
          </div>

          {/* Right Side - Product Grid */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {products.slice(0, 6).map((product) => (
                <Link
                  href={`/allproducts/${product?.slug || product?._id}`}
                  key={product._id}
                  className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  {/* Product Image */}
                  <div className="relative h-64 overflow-hidden bg-gray-100">
                    {product?.image?.[0] ? (
                      <img
                        src={product.image[0]}
                        alt={product?.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <span className="text-4xl">👕</span>
                      </div>
                    )}

                    {/* Discount Badge */}
                    {product?.discount && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        -{product.discount}%
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-3">
                    <h4 className="font-semibold text-sm text-gray-900 line-clamp-1 mb-2 group-hover:text-blue-600 transition-colors">
                      {product?.title}
                    </h4>

                    {/* Price */}
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-900">
                        ৳{product?.price?.toFixed(2)}
                      </span>
                      {product?.originalPrice && product.originalPrice > product.price && (
                        <span className="text-xs text-gray-500 line-through">
                          ৳{product.originalPrice?.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}

              {/* View More Card */}
              <Link
                href="/category/polo"
                className="group relative bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex items-center justify-center h-64"
              >
                <div className="text-center p-6">
                  <div className="mb-4">
                    <svg
                      className="w-16 h-16 mx-auto text-white group-hover:scale-110 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </div>
                  <h3 className="text-white text-xl font-bold mb-2">
                    VIEW MORE
                  </h3>
                  <p className="text-white/90 text-sm">
                    Explore all polo collection
                  </p>
                </div>

                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

export default KurtiTopsSection
"use client"
import React, { useState, useEffect } from 'react'
import Container from '@/components/common/Container'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { Heart, ShoppingCart, Trash2, X, Share2, HeartOff } from 'lucide-react'

const Page = () => {
  const router = useRouter()
  const userId = useSelector((state) => state.user.value)
  
  const [wishlistItems, setWishlistItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [notification, setNotification] = useState({ show: false, type: '', message: '' })

  useEffect(() => {
    fetchWishlist()
  }, [userId?._id])

  const fetchWishlist = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API}/wishlist/getwishlist/${userId?._id}`)
      const items = res?.data?.data || []
      
      // Map wishlist items
      const mapped = items.map(item => ({
        _id: item._id,
        productId: item.product?._id,
        title: item.product?.title,
        image: item.product?.image?.[0],
        price: item.product?.price,
        originalPrice: item.product?.originalPrice,
        stock: item.product?.stock,
        slug: item.product?.slug,
        discount: item.product?.discount
      }))
      
      setWishlistItems(mapped)
    } catch (err) {
      console.error('Error fetching wishlist:', err)
    } finally {
      setLoading(false)
    }
  }

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message })
    setTimeout(() => {
      setNotification({ show: false, type: '', message: '' })
    }, 3000)
  }

  const handleRemoveItem = async (itemId) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API}/wishlist/removewishlist/${itemId}`)
      setWishlistItems(prev => prev.filter(item => item._id !== itemId))
      showNotification('success', 'Removed from wishlist')
    } catch (err) {
      console.error('Remove error:', err)
      showNotification('error', 'Failed to remove item')
    }
  }

//   const handleAddToCart = async (item) => {
//     try {
//       await axios.post(`${process.env.NEXT_PUBLIC_API}/cart/addtocart`, {
//         user: userId?._id,
//         product: product._id,
//         quantity: 1
//       })
//       showNotification('success', 'Added to cart!')
//     } catch (err) {
//       console.error('Add to cart error:', err)
//       showNotification('error', 'Failed to add to cart')
//     }
//   }

  const handleClearWishlist = async () => {
    
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API}/wishlist/deletewishlist/${userId?._id}`)
      setWishlistItems([])
      showNotification('success', 'Wishlist cleared')
    } catch (err) {
      console.error('Clear wishlist error:', err)
      showNotification('error', 'Failed to clear wishlist')
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Wishlist - Pick & Go',
        text: 'Check out my wishlist!',
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      showNotification('success', 'Link copied to clipboard!')
    }
  }

  if (loading) {
    return (
      <section className="py-16 bg-gray-50 min-h-screen">
        <Container>
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Loading wishlist...</h2>
          </div>
        </Container>
      </section>
    )
  }

  return (
    <section className="py-12 bg-gray-50 min-h-screen">
      <Container>
        {/* Notification Toast */}
        {notification.show && (
          <div className="fixed top-4 right-4 z-50 animate-slide-in">
            <div className={`flex items-center gap-3 p-4 rounded-lg shadow-lg ${
              notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            } text-white`}>
              <Heart className="w-5 h-5" />
              <p className="text-sm font-medium">{notification.message}</p>
              <button onClick={() => setNotification({ show: false, type: '', message: '' })}>
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              My Wishlist
            </h1>
            <p className="text-gray-600">
              {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
            </p>
          </div>
          
          {wishlistItems.length > 0 && (
            <div className="flex gap-3">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Share</span>
              </button>
              <button
                onClick={handleClearWishlist}
                className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Clear All</span>
              </button>
            </div>
          )}
        </div>

        {wishlistItems.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-pink-100 to-red-100 rounded-full flex items-center justify-center">
                <HeartOff className="w-12 h-12 text-red-400" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Your Wishlist is Empty
              </h2>
              <p className="text-gray-600 mb-8">
                Start adding items you love to your wishlist! Browse our collection and save your favorites.
              </p>
              <Link
                href="/allproducts"
                className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-8 py-3 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                Explore Products
              </Link>
            </div>
          </div>
        ) : (
          /* Wishlist Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <div
                key={item._id}
                className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden relative"
              >
                {/* Remove Button */}
                <button
                  onClick={() => handleRemoveItem(item._id)}
                  className="absolute top-3 right-3 z-10 bg-white p-2 rounded-full shadow-lg hover:bg-red-50 transition-all group/btn"
                >
                  <Heart className="w-5 h-5 text-red-500 fill-red-500 group-hover/btn:scale-110 transition-transform" />
                </button>

                {/* Discount Badge */}
                {item.discount && (
                  <div className="absolute top-3 left-3 z-10 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    -{item.discount}%
                  </div>
                )}

                {/* Product Image */}
                <Link href={`/allproducts/${item.slug || item.productId}`}>
                  <div className="relative h-64 overflow-hidden bg-gray-100">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                        <span className="text-6xl">📦</span>
                      </div>
                    )}
                  </div>
                </Link>

                {/* Product Info */}
                <div className="p-4">
                  <Link href={`/product/${item.slug || item.productId}`}>
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                      {item.title || 'Product Name'}
                    </h3>
                  </Link>

                  {/* Price */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl font-bold text-gray-900">
                      ৳{item.price?.toFixed(2) || '0.00'}
                    </span>
                    {item.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        ৳{item.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* Stock Status */}
                  <p className={`text-xs mb-3 ${item.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {item.stock > 0 ? `In Stock (${item.stock})` : 'Out of Stock'}
                  </p>

                  {/* Actions */}
                  <div className='mt-5' >
                    {/* <button
                      onClick={() => handleAddToCart(item)}
                      disabled={item.stock <= 0}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-2 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </button> */}
                    <Link
                      href={`/allproducts/${item.slug || item.productId}`}
                      className="bg-gray-100 text-gray-700 font-semibold py-2 px-30 rounded-lg hover:bg-green-300 transition-all text-center"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Move All to Cart Button */}
        {/* {wishlistItems.length > 0 && (
          <div className="mt-8 text-center">
            <button
              onClick={() => {
                wishlistItems.forEach(item => handleAddToCart(item))
              }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-8 py-4 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              <ShoppingCart className="w-5 h-5" />
              Add All to Cart
            </button>
          </div>
        )} */}
      </Container>

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </section>
  )
}

export default Page
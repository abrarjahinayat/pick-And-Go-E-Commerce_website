import React from 'react'
import Link from 'next/link'
import { ShoppingCart, Search, User, Heart, Menu } from 'lucide-react'

const Header = () => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center text-sm">
            <p className="hidden sm:block">Free shipping on orders over $50</p>
            <div className="flex items-center gap-4 ml-auto">
              <Link href="/track-order" className="hover:underline">Track Order</Link>
              <Link href="/help" className="hover:underline">Help</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-2xl px-3 py-1 rounded-lg">
              P&G
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Pick & Go
            </span>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search for products..."
                className="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-6">
            <Link href="/account" className="hidden sm:flex items-center space-x-1 hover:text-blue-600 transition">
              <User className="w-5 h-5" />
              <span className="text-sm font-medium">Account</span>
            </Link>

            <Link href="/wishlist" className="hidden sm:block relative hover:text-blue-600 transition">
              <Heart className="w-5 h-5" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                3
              </span>
            </Link>

            <Link href="/cart" className="relative hover:text-blue-600 transition">
              <ShoppingCart className="w-6 h-6" />
              <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                5
              </span>
            </Link>

            <button className="md:hidden hover:text-blue-600 transition">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="hidden md:flex items-center justify-center space-x-8 h-12">
            <Link href="/new-arrivals" className="text-sm font-medium hover:text-blue-600 transition">
              New Arrivals
            </Link>
            <Link href="/products" className="text-sm font-medium hover:text-blue-600 transition">
             All Products
            </Link>
            <Link href="/men" className="text-sm font-medium hover:text-blue-600 transition">
              Men
            </Link>
            <Link href="/women" className="text-sm font-medium hover:text-blue-600 transition">
              Women
            </Link>
            <Link href="/kids" className="text-sm font-medium hover:text-blue-600 transition">
              Kids
            </Link>
            <Link href="/accessories" className="text-sm font-medium hover:text-blue-600 transition">
              Accessories
            </Link>
            <Link href="/sale" className="text-sm font-medium text-red-600 hover:text-red-700 transition">
              Sale 🔥
            </Link>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header
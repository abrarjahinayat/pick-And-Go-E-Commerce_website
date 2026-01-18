"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube } from 'lucide-react'

const Footer = () => {
  const [email, setEmail] = useState('')

  const handleSubscribe = (e) => {
    e.preventDefault()
    console.log('Subscribe email:', email)
    // Add your subscription logic here
    setEmail('')
  }

  return (
    <footer className="bg-white border-t border-gray-200">
      {/* Trust Badges Section */}
      <div className="bg-gray-50 py-8 sm:py-12 md:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Payment Methods */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-sm sm:text-base">All secure payment methods</h3>
              <div className="flex flex-wrap justify-center gap-2 mt-3 sm:mt-4">
                <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa" className="h-6 sm:h-8 object-contain" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b7/MasterCard_Logo.svg" alt="Mastercard" className="h-6 sm:h-8 object-contain" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg" alt="Amex" className="h-6 sm:h-8 object-contain" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-6 sm:h-8 object-contain" />
              </div>
            </div>

            {/* Quality Guarantee */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-sm sm:text-base">Satisfaction guaranteed</h3>
              <p className="text-xs sm:text-sm text-gray-600">Made with premium quality materials.</p>
              <p className="text-xs sm:text-sm text-gray-600">Cozy yet lasts the test of time</p>
            </div>

            {/* Delivery Partners */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-orange-600 to-red-600 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                </div>
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-sm sm:text-base">Worldwide delivery</h3>
              <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-3 sm:mt-4">
                <span className="bg-yellow-400 text-black font-bold px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs">DHL</span>
                <span className="bg-purple-700 text-white font-bold px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs">FedEx</span>
                <span className="text-orange-600 font-bold px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs border border-orange-600">Pathao</span>
                <span className="bg-red-600 text-white font-bold px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs">SUNDARBAN</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="bg-gray-800 text-white py-8 sm:py-10 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {/* Company Info */}
            <div>
              <Link href="/" className="inline-flex items-center space-x-2 mb-4 sm:mb-6">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg sm:text-xl px-2 sm:px-3 py-1 rounded-lg">
                  P&G
                </div>
                <span className="text-lg sm:text-xl font-bold text-white">Pick & Go</span>
              </Link>
              <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                <li><Link href="/about" className="text-gray-300 hover:text-white transition-colors">About Pick & Go</Link></li>
                <li><Link href="/terms" className="text-gray-300 hover:text-white transition-colors">Terms & Conditions</Link></li>
                <li><Link href="/privacy" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/returns" className="text-gray-300 hover:text-white transition-colors">Cancellation & Return Policy</Link></li>
                <li><Link href="/faq" className="text-gray-300 hover:text-white transition-colors">FAQs</Link></li>
                <li><Link href="/contact" className="text-gray-300 hover:text-white transition-colors">Contact Us</Link></li>
              </ul>
            </div>

            {/* Newsletter */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
                <h3 className="font-bold text-sm sm:text-base md:text-lg">GET SPECIAL DISCOUNTS IN YOUR INBOX</h3>
              </div>
              <form onSubmit={handleSubscribe} className="mb-4 sm:mb-6">
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email to get offers, discounts and more."
                    className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-gray-700 text-white text-sm sm:text-base rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder-gray-400"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base rounded-lg transition-colors"
                  >
                    Subscribe
                  </button>
                </div>
              </form>

              <div className="mb-4 sm:mb-6">
                <div className="flex items-center gap-2 mb-2 sm:mb-3">
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
                  <h3 className="font-bold text-sm sm:text-base">FOR ANY HELP YOU MAY CALL US AT</h3>
                </div>
                <p className="text-gray-300 mb-1 text-sm sm:text-base">+880 96 77 66 88 88</p>
                <p className="text-xs sm:text-sm text-gray-400">Customer Service</p>
                <p className="text-xs sm:text-sm text-gray-400">Track your order or get help returning an order</p>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                  <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                </svg>
                <h3 className="font-bold text-sm sm:text-base">FOLLOW US</h3>
              </div>
              <p className="text-xs sm:text-sm text-gray-300 mb-3 sm:mb-4">
                Stay updated on our latest arrivals, exclusive promotions and events.
              </p>

              {/* Social Icons */}
              <div className="flex gap-2 sm:gap-3 mb-4 sm:mb-6">
                <a href="#" className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-700 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors">
                  <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
                <a href="#" className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-700 hover:bg-gray-900 rounded-full flex items-center justify-center transition-colors">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a href="#" className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-700 hover:bg-blue-500 rounded-full flex items-center justify-center transition-colors">
                  <Facebook className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
                <a href="#" className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-700 hover:bg-blue-400 rounded-full flex items-center justify-center transition-colors">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"/>
                  </svg>
                </a>
                <a href="#" className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-700 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors">
                  <Youtube className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
              </div>

              {/* Facebook Follow Plugin */}
              <div className="bg-white rounded-lg p-2 sm:p-3">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <Facebook className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-900 font-semibold text-xs sm:text-sm">Pick & Go</p>
                    <p className="text-gray-500 text-[10px] sm:text-xs">896K followers • 1 following</p>
                  </div>
                </div>
              </div>

              {/* App Download */}
              <div className="mt-4 sm:mt-6 space-y-2">
                <a href="#" className="block">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Get it on Google Play" className="h-8 sm:h-10" />
                </a>
                <a href="#" className="block">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="Download on App Store" className="h-8 sm:h-10" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-900 text-gray-400 py-3 sm:py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-xs sm:text-sm">
              Your order is handled daily with a lot of ❤️ and delivered worldwide!
            </p>
            <p className="text-[10px] sm:text-xs mt-1 sm:mt-2">
              Copyright © 2024 Pick & Go Limited. All Right Reserved
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
"use client";
import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import { ShoppingCart, Search, User, Heart, Menu, LogOut } from "lucide-react";
import axios from "axios";

const Header = () => {
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [cartData, setCartData] = useState([]);
  const [wishlistData, setWishlistData] = useState([]);

  // 🔍 SEARCH (NEW)
  const [searchText, setSearchText] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const searchRef = useRef(null);

  const user = useSelector((state) => state.user.value);
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem("token");
  };

  // ---------------- CART ----------------
  useEffect(() => {
    if (!user?._id) return;
    axios
      .get(`${process.env.NEXT_PUBLIC_API}/cart/singlecart/${user?._id}`)
      .then((res) => setCartData(res?.data?.data))
      .catch(() => {});
  }, [user?._id]);

  // ---------------- WISHLIST ----------------
  useEffect(() => {
    if (!user?._id) return;
    axios
      .get(
        `${process.env.NEXT_PUBLIC_API}/wishlist/getsinglewishlist/${user?._id}`
      )
      .then((res) => setWishlistData(res?.data?.data))
      .catch(() => {});
  }, [user?._id]);

  // ---------------- FETCH ALL PRODUCTS (SEARCH) ----------------
  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API}/products/allproducts`)
      .then((res) => setAllProducts(res?.data?.data || []))
      .catch(() => {});
  }, []);

  // ---------------- FILTER SEARCH ----------------
  useEffect(() => {
    if (!searchText.trim()) {
      setSuggestions([]);
      return;
    }

    const filtered = allProducts
      .filter((item) =>
        item?.title?.toLowerCase().includes(searchText.toLowerCase())
      )
      .slice(0, 6);

    setSuggestions(filtered);
  }, [searchText, allProducts]);

  // ---------------- CLICK OUTSIDE CLOSE ----------------
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    { href: "/new-arrivals", label: "New Arrivals" },
    { href: "/allproducts", label: "All Products" },
    { href: "/men", label: "Men" },
    { href: "/women", label: "Women" },
    { href: "/kids", label: "Kids" },
    { href: "/accessories", label: "Accessories" },
    { href: "/sale", label: "Sale 🔥", isSpecial: true },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center text-sm">
            <p className="hidden sm:block">
              • Spend ৳1000 & get ৳100 off with
              Coupon: <strong>AJA50</strong>
            </p>
            <div className="flex items-center gap-4 ml-auto">
              <Link href="/track-order" className="hover:underline">
                Track Order
              </Link>
              <Link href="/help" className="hover:underline">
                Help
              </Link>
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

          {/* 🔍 SEARCH BAR (ONLY AREA MODIFIED) */}
          <div
            ref={searchRef}
            className="hidden md:flex flex-1 max-w-2xl mx-8 relative"
          >
            <div className="relative w-full">
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search for products..."
                className="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>

            {/* 🔽 SEARCH SUGGESTIONS */}
            {suggestions.length > 0 && (
              <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-lg border z-50 max-h-80 overflow-y-auto">
                {suggestions.map((product) => (
                  <Link
                    key={product._id}
                    href={`/allproducts/${product.slug}`}
                    onClick={() => setSearchText("")}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50"
                  >
                    <img
                      src={product.image[0]}
                      alt={product.title}
                      className="w-12 h-12 object-contain"
                    />
                    <div>
                      <p className="text-sm font-medium line-clamp-1">
                        {product.title}
                      </p>
                      <p className="text-sm text-red-600 font-semibold">
                        ৳{product.price}
                        {product.originalPrice && (
                          <span className="line-through text-gray-400 ml-2">
                            ৳{product.originalPrice}
                          </span>
                        )}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* ✅ RIGHT SIDE — UNCHANGED */}
          <div className="flex items-center space-x-6">
            <div
              className="hidden sm:block relative"
              onMouseEnter={() => setShowAccountMenu(true)}
              onMouseLeave={() => setShowAccountMenu(false)}
            >
              <div className="flex items-center space-x-1 hover:text-blue-600 transition cursor-pointer">
                <User className="w-5 h-5" />
                <span className="text-sm font-medium">
                  {user?.name || "Account"}
                </span>
              </div>

              {showAccountMenu && (
                <div className="absolute right-0 mt-1.5 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50">
                  {user?.name ? (
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 cursor-pointer hover:text-red-600 transition-colors flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        Login
                      </Link>
                      <Link
                        href="/register"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        Register
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            <Link
              href="/wishlist"
              className="hidden sm:block relative hover:text-blue-600 transition"
            >
              <Heart className="w-5 h-5" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {wishlistData?.length || 0}
              </span>
            </Link>

            <Link
              href="/cart"
              className="relative hover:text-blue-600 transition"
            >
              <ShoppingCart className="w-6 h-6" />
              <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                {cartData?.length || 0}
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
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative text-sm font-medium transition group"
                >
                  <span
                    className={`${
                      item.isSpecial
                        ? isActive
                          ? "text-red-700"
                          : "text-red-600 group-hover:text-red-700"
                        : isActive
                        ? "text-blue-600"
                        : "text-gray-700 group-hover:text-blue-600"
                    }`}
                  >
                    {item.label}
                  </span>
                  <span
                    className={`absolute bottom-[-13px] left-0 h-0.5 bg-gradient-to-r transition-all duration-300 ${
                      item.isSpecial
                        ? "from-red-500 to-red-600"
                        : "from-blue-500 to-purple-600"
                    } ${
                      isActive
                        ? "w-full opacity-100"
                        : "w-0 group-hover:w-full opacity-0 group-hover:opacity-100"
                    }`}
                  ></span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;

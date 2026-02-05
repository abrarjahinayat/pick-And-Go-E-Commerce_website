"use client";
import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import {
  ShoppingCart,
  Search,
  User,
  Heart,
  Menu,
  LogOut,
  X,
  Tag,
  Percent,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import axios from "axios";
import { userinfo } from "../../slices/userSlice";

const Header = () => {
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [cartData, setCartData] = useState([]);
  const [wishlistData, setWishlistData] = useState([]);
  const [isNavigating, setIsNavigating] = useState(false);

  // 🎟️ COUPON STATE
  const [activeCoupons, setActiveCoupons] = useState([]);
  const [currentCouponIndex, setCurrentCouponIndex] = useState(0);

  // 🔍 SEARCH
  const [searchText, setSearchText] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const searchRef = useRef(null);

  const user = useSelector((state) => state.user.value);
  const pathname = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch(userinfo(null));
    setShowMobileMenu(false);
    window.location.href = "/login";
  };

  // ✅ REHYDRATE USER FROM LOCALSTORAGE ON PAGE LOAD
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && !user) {
      try {
        const parsedUser = JSON.parse(storedUser);
        dispatch(userinfo(parsedUser));
      } catch (error) {
        console.error("Failed to parse user from localStorage", error);
      }
    }
  }, [dispatch, user]);

  // ---------------- FETCH ACTIVE COUPONS ----------------
  useEffect(() => {
    const fetchActiveCoupons = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API}/coupon/allcoupon`
        );
        const coupons = res?.data?.data || [];

        // Filter only active and non-expired coupons
        const now = new Date();
        const active = coupons.filter((coupon) => {
          const isActive = coupon.isActive;
          const notExpired = coupon.expiryDate
            ? new Date(coupon.expiryDate) > now
            : true;
          const hasUsageLeft = coupon.usageLimit
            ? (coupon.usedCount || 0) < coupon.usageLimit
            : true;

          return isActive && notExpired && hasUsageLeft;
        });

        setActiveCoupons(active);
      } catch (error) {
        console.error("Error fetching coupons:", error);
      }
    };

    fetchActiveCoupons();

    // Refresh coupons every 5 minutes
    const interval = setInterval(fetchActiveCoupons, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // ---------------- AUTO-ROTATE COUPONS ----------------
  useEffect(() => {
    if (activeCoupons.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentCouponIndex((prev) => (prev + 1) % activeCoupons.length);
    }, 8000); // Change coupon every 8 seconds

    return () => clearInterval(interval);
  }, [activeCoupons.length]);

  // ---------------- MANUAL COUPON NAVIGATION ----------------
  const nextCoupon = () => {
    setCurrentCouponIndex((prev) => (prev + 1) % activeCoupons.length);
  };

  const prevCoupon = () => {
    setCurrentCouponIndex(
      (prev) => (prev - 1 + activeCoupons.length) % activeCoupons.length
    );
  };

  // ---------------- CART ----------------
  useEffect(() => {
    if (!user?._id) return;
    axios
      .get(`${process.env.NEXT_PUBLIC_API}/cart/singlecart/${user?._id}`)
      .then((res) => setCartData(res?.data?.data))
      .catch(() => {});
  }, [user?._id, cartData]);

  // ---------------- WISHLIST ----------------
  useEffect(() => {
    if (!user?._id) return;
    axios
      .get(
        `${process.env.NEXT_PUBLIC_API}/wishlist/getsinglewishlist/${user?._id}`
      )
      .then((res) => setWishlistData(res?.data?.data))
      .catch(() => {});
  }, [user?._id, wishlistData]);

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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle search suggestion click for desktop
  const handleSuggestionClick = () => {
    setSearchText("");
    setSuggestions([]);
  };

  // Handle mobile product navigation
  const handleMobileProductClick = (slug) => {
    setIsNavigating(true);
    setSearchText("");
    setSuggestions([]);
    
    // Navigate immediately
    router.push(`/allproducts/${slug}`);
    
    // Close search after a short delay
    setTimeout(() => {
      setShowMobileSearch(false);
      setIsNavigating(false);
    }, 300);
  };

  const navItems = [
    { href: "/new-arrivals", label: "New Arrivals" },
    { href: "/allproducts", label: "All Products" },
    { href: "/men", label: "Men" },
    { href: "/women", label: "Women" },
    { href: "/kids", label: "Kids" },
    { href: "/accessories", label: "Accessories" },
    { href: "/sale", label: "Sale 🔥", isSpecial: true },
  ];

  // Get current coupon to display
  const currentCoupon = activeCoupons[currentCouponIndex];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Top Bar - Dynamic Coupon */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center text-xs sm:text-sm">
            {/* Coupon Display */}
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {activeCoupons.length > 0 && currentCoupon ? (
                <>
                  <Tag className="w-4 h-4 flex-shrink-0 animate-pulse" />
                  <p className="truncate">
                    {currentCoupon.description ? (
                      <span>{currentCoupon.description} • Use code: </span>
                    ) : (
                      <span>
                        Get ৳{currentCoupon.amout} off on orders above ৳
                        {currentCoupon.minPrice} • Code:{" "}
                      </span>
                    )}
                    <strong className="bg-white/20 px-2 py-0.5 rounded">
                      {currentCoupon.code}
                    </strong>
                    {currentCoupon.expiryDate && (
                      <span className="ml-2 text-xs opacity-90">
                        • Expires{" "}
                        {new Date(currentCoupon.expiryDate).toLocaleDateString()}
                      </span>
                    )}
                  </p>
                </>
              ) : (
                <>
                  <Percent className="w-4 h-4 flex-shrink-0" />
                  <p className="truncate">
                    Free shipping on orders over ৳1000 • Shop Now!
                  </p>
                </>
              )}
            </div>

            {/* Navigation Arrows (Desktop - if multiple coupons) */}
            {activeCoupons.length > 1 && (
              <div className="hidden sm:flex items-center gap-2 ml-4">
                <button
                  onClick={prevCoupon}
                  className="hover:bg-white/20 p-1 rounded transition"
                  aria-label="Previous coupon"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs">
                  {currentCouponIndex + 1}/{activeCoupons.length}
                </span>
                <button
                  onClick={nextCoupon}
                  className="hover:bg-white/20 p-1 rounded transition"
                  aria-label="Next coupon"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Right Side Links */}
            <div className="hidden sm:flex items-center gap-4 ml-4">
              <Link
                href="/track-order"
                className="hover:underline whitespace-nowrap"
              >
                Track Order
              </Link>
              <Link href="/help" className="hover:underline">
                Help
              </Link>
            </div>
          </div>

          {/* Mobile Coupon Navigation Dots */}
          {activeCoupons.length > 1 && (
            <div className="flex sm:hidden justify-center gap-1 mt-1">
              {activeCoupons.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentCouponIndex(index)}
                  className={`w-1.5 h-1.5 rounded-full transition ${
                    index === currentCouponIndex
                      ? "bg-white w-4"
                      : "bg-white/40"
                  }`}
                  aria-label={`Go to coupon ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-xl sm:text-2xl px-2 sm:px-3 py-1 rounded-lg">
              P&G
            </div>
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hidden sm:inline">
              Pick & Go
            </span>
          </Link>

          {/* Desktop Search Bar */}
          <div
            ref={searchRef}
            className="hidden md:flex flex-1 max-w-2xl mx-8 relative"
          >
            <div className="relative w-full">
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search for products by Title or Tags..."
                className="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>

            {/* Search Suggestions - Desktop */}
            {suggestions.length > 0 && (
              <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-lg border z-[60] max-h-80 overflow-y-auto">
                {suggestions.map((product) => (
                  <Link
                    key={product._id}
                    href={`/allproducts/${product.slug}`}
                    onClick={handleSuggestionClick}
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

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4 sm:space-x-6">
            {/* Mobile Search Icon */}
            <button
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              className="md:hidden hover:text-blue-600 transition"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Account - Desktop Only */}
            <div
              className="hidden md:block relative"
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
                    <>
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 cursor-pointer hover:text-red-600 transition-colors flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                      <Link
                        href="/orders"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        My Orders
                      </Link>
                    </>
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

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="relative hover:text-blue-600 transition"
            >
              <Heart className="w-5 h-5" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {wishlistData?.length || 0}
              </span>
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative hover:text-blue-600 transition"
            >
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center font-semibold">
                {cartData?.length || 0}
              </span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden hover:text-blue-600 transition"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search Dropdown with Animation */}
      <div
        className={`md:hidden border-t border-gray-200 bg-white transition-all duration-300 ease-in-out ${
          showMobileSearch && !isNavigating ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden`}
      >
        <div className="px-4 py-4">
          <div className="relative">
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search products..."
              className="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>

          {/* Search Suggestions - Mobile */}
          {suggestions.length > 0 && (
            <div className="mt-3 bg-white rounded-xl shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
              {suggestions.map((product) => (
                <button
                  key={product._id}
                  onClick={() => handleMobileProductClick(product.slug)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 active:bg-blue-50 cursor-pointer text-left"
                >
                  <img
                    src={product.image[0]}
                    alt={product.title}
                    className="w-12 h-12 object-contain flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-1">
                      {product.title}
                    </p>
                    <p className="text-sm text-red-600 font-semibold">
                      ৳{product.price}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Desktop Navigation Menu */}
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

      {/* Mobile Menu Sidebar with Blur Backdrop */}
      <>
        {/* Backdrop with Blur Effect - visible when menu is open */}
        <div
          className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ${
            showMobileMenu
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setShowMobileMenu(false)}
        ></div>

        {/* Sidebar with Slide Animation */}
        <div
          className={`fixed top-0 right-0 h-full w-72 bg-white shadow-2xl z-50 md:hidden overflow-y-auto transform transition-transform duration-300 ease-in-out ${
            showMobileMenu ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="p-4">
            {/* Close Button */}
            <button
              onClick={() => setShowMobileMenu(false)}
              className="absolute top-4 right-10 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* User Info */}
            <div className="mb-6 pt-2">
              <div className="flex items-center gap-2 mb-4">
                <User className="w-6 h-6 text-blue-600" />
                <span className="font-semibold text-gray-900">
                  {user?.name || "Guest"}
                </span>
              </div>

              {user?.name ? (
                <div className="space-y-2">
                  <Link
                    href="/orders"
                    onClick={() => setShowMobileMenu(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                  >
                    My Orders
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    href="/login"
                    onClick={() => setShowMobileMenu(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setShowMobileMenu(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>

            {/* Navigation Links */}
            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">
                Navigation
              </h3>
              <div className="space-y-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setShowMobileMenu(false)}
                      className={`block px-4 py-2 rounded-lg transition-colors ${
                        isActive
                          ? item.isSpecial
                            ? "bg-red-50 text-red-600 font-medium"
                            : "bg-blue-50 text-blue-600 font-medium"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Additional Links */}
            <div className="border-t border-gray-200 mt-4 pt-4">
              <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">
                Help & Support
              </h3>
              <div className="space-y-1">
                <Link
                  href="/track-order"
                  onClick={() => setShowMobileMenu(false)}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  Track Order
                </Link>
                <Link
                  href="/help"
                  onClick={() => setShowMobileMenu(false)}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  Help Center
                </Link>
              </div>
            </div>
          </div>
        </div>
      </>
    </header>
  );
};

export default Header;
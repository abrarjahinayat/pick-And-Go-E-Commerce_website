"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Image,
  Tag,
  Layers,
  Gift,
  Settings,
  Menu,
  X,
  LogOut,
  ChevronDown,
  FileImage,
  Grid3x3,
  User,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [adminInfo, setAdminInfo] = useState(null);
  const pathname = usePathname();
  const router = useRouter();

  // Get admin info from localStorage
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        setAdminInfo(parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    
    // Show success message
    toast.success("Logged out successfully");
    
    // Close modal
    setShowLogoutModal(false);
    
    // Redirect to login page
    setTimeout(() => {
      router.push("/admin/login");
    }, 500);
  };

  const menuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/admin",
      exact: true,
    },
    {
      title: "Products",
      icon: Package,
      submenu: [
        { title: "All Products", href: "/admin/products" },
        { title: "Add Product", href: "/admin/products/add" },
        { title: "Categories", href: "/admin/categories" },
        { title: "Subcategories", href: "/admin/subcategories" },
        { title: "Variants", href: "/admin/variants" },
      ],
    },
    {
      title: "Orders",
      icon: ShoppingCart,
      href: "/admin/orders",
    },
    {
      title: "Customers",
      icon: Users,
      href: "/admin/customers",
    },
    {
      title: "Banners",
      icon: Image,
      href: "/admin/banners",
    },
    {
      title: "Feature Images",
      icon: FileImage,
      href: "/admin/feature-images",
    },
    {
      title: "Collection Banners",
      icon: Grid3x3,
      href: "/admin/collection-banners",
    },
    {
      title: "Coupons",
      icon: Tag,
      href: "/admin/coupons",
    },
    {
      title: "Settings",
      icon: Settings,
      href: "/admin/settings",
    },
  ];

  const isActive = (href, exact = false) => {
    if (exact) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <header className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-30 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition"
            >
              {sidebarOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>

            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-xl px-3 py-1 rounded-lg shadow-md">
                P&G
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hidden sm:inline">
                Admin Panel
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {/* Admin Info */}
            {adminInfo && (
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg border border-blue-100">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <div className="text-xs">
                  <p className="font-semibold text-gray-900">{adminInfo.name}</p>
                  <p className="text-gray-500">{adminInfo.role}</p>
                </div>
              </div>
            )}

            {/* View Site Button */}
            <Link
              href="/"
              target="_blank"
              className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              <span>View Site</span>
            </Link>

            {/* Logout Button */}
            <button
              onClick={() => setShowLogoutModal(true)}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed top-[57px] left-0 bottom-0 w-64 bg-white border-r border-gray-200 z-20 transition-transform duration-300 overflow-hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="h-full overflow-y-auto py-6">
          {/* Admin Profile in Sidebar (Mobile) */}
          {adminInfo && (
            <div className="lg:hidden px-3 mb-6">
              <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  {adminInfo.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {adminInfo.name}
                  </p>
                  <p className="text-xs text-gray-500">{adminInfo.email}</p>
                </div>
              </div>
            </div>
          )}

          <nav className="space-y-1 px-3">
            {menuItems.map((item) => {
              if (item.submenu) {
                return (
                  <div key={item.title}>
                    <button
                      onClick={() => setProductsOpen(!productsOpen)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition ${
                        isActive("/admin/products") ||
                        isActive("/admin/categories") ||
                        isActive("/admin/subcategories") ||
                        isActive("/admin/variants")
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="w-5 h-5" />
                        {item.title}
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          productsOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {productsOpen && (
                      <div className="mt-1 ml-8 space-y-1">
                        {item.submenu.map((subitem) => (
                          <Link
                            key={subitem.href}
                            href={subitem.href}
                            onClick={() => setSidebarOpen(false)}
                            className={`block px-3 py-2 rounded-lg text-sm transition ${
                              isActive(subitem.href)
                                ? "bg-blue-50 text-blue-600 font-medium"
                                : "text-gray-600 hover:bg-gray-100"
                            }`}
                          >
                            {subitem.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                    isActive(item.href, item.exact)
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.title}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-10 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
              <LogOut className="w-6 h-6 text-red-600" />
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
              Confirm Logout
            </h3>
            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to logout from the admin panel?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="lg:ml-64 mt-[57px] min-h-[calc(100vh-57px)]">
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
};

export default AdminLayout;
"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";

const AdminProtectedRoute = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");

        // Check if token and user exist in localStorage
        if (!token || !user) {
          router.push("/admin/login");
          return;
        }

        const parsedToken = JSON.parse(token);
        const parsedUser = JSON.parse(user);

        // First check: Verify user role is admin (frontend check)
        if (parsedUser.role !== "admin") {
          toast.error("Access denied. Admin privileges required.");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          router.push("/admin/login");
          return;
        }

        // Second check: Verify token with backend
        try {
          const res = await axios.get(
            `${process.env.NEXT_PUBLIC_API}/auth/verifyUser`,
            {
              headers: {
                token: parsedToken,
              },
            }
          );

          if (res.data.success && res.data.data.role === "admin") {
            // Update token if backend returns a new one
            if (res.data.token) {
              localStorage.setItem("token", JSON.stringify(res.data.token));
            }
            // Update user data if backend returns updated data
            if (res.data.data) {
              localStorage.setItem("user", JSON.stringify(res.data.data));
            }
            setIsAuthenticated(true);
          } else {
            throw new Error("Invalid admin credentials");
          }
        } catch (error) {
          console.error("Token verification failed:", error);
          toast.error("Session expired. Please login again.");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          router.push("/admin/login");
        }
      } catch (error) {
        console.error("Auth check error:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/admin/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router, pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Verifying Admin Access
          </h3>
          <p className="text-sm text-gray-600">
            Please wait while we authenticate your credentials...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

export default AdminProtectedRoute;
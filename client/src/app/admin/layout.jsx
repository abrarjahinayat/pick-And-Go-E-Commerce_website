"use client";
import { usePathname } from "next/navigation";
import AdminLayout from "../../../src/components/admin/AdminLayout";
import AdminProtectedRoute from "../../../src/components/admin/AdminProtectedRoute";
import { Toaster } from "sonner";

export default function Layout({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  // Don't protect login page
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Protect all other admin pages
  return (
    <AdminProtectedRoute>
      <AdminLayout>{children}
        {/* Toaster should be OUTSIDE the VerifyUser component to avoid duplicates */}
        <Toaster
          position="top-right"
          richColors
          expand={false}
          duration={3000}
          toastOptions={{
            className: "sonner-toast",
            style: {
              background: 'white',
              border: '1px solid #e5e7eb',
            },
          }}
        />
      </AdminLayout>
    </AdminProtectedRoute>
    
  );
}
"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Products from '@/components/common/Products';

export default function CategoryProducts() {
  const { categorySlug } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(
         `${process.env.NEXT_PUBLIC_API}/products/category/${categorySlug}`,
          {
            cache: 'no-store',
            headers: {
              'Content-Type': 'application/json',
            }
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Handle different response formats
        const productData = data.products || data.data || data;
        setProducts(Array.isArray(productData) ? productData : []);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    if (categorySlug) {
      fetchProducts();
    }
  }, [categorySlug]);

  // Format category name for display
  const formatCategoryName = (categorySlug) => {
    return categorySlug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <section className="pb-6 sm:pb-8 md:pb-10 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <div className="container mx-auto px-2 sm:px-4">
        {/* Category Header */}
        <div className="text-center py-6 sm:py-8 md:py-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">
            {formatCategoryName(categorySlug)}
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            {loading ? "Loading..." : `${products.length} Products Found`}
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12 sm:py-16 md:py-20">
            <div className="animate-spin rounded-full h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 border-t-4 border-b-4 border-blue-600"></div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-12 sm:py-16 md:py-20">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-5 md:p-6 max-w-md mx-auto">
              <p className="text-red-600 text-base sm:text-lg font-semibold">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-3 sm:mt-4 bg-red-600 text-white px-5 sm:px-6 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Products Grid - 2 columns on mobile, responsive for larger screens */}
        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {products.map((product) => (
              <Products product={product} key={product._id} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && products.length === 0 && (
          <div className="text-center py-12 sm:py-16 md:py-20">
            <div className="max-w-md mx-auto px-4">
              <div className="text-6xl sm:text-7xl md:text-8xl mb-3 sm:mb-4">📦</div>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">
                No Products Found
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                We couldn't find any products in the "{formatCategoryName(categorySlug)}" category.
              </p>
              <a
                href="/"
                className="inline-block bg-blue-600 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm sm:text-base"
              >
                Back to Home
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
'use client'

import { useState, useMemo } from 'react'
import Products from '@/components/common/Products'
import FilterSidebar from '@/components/common/FilterSidebar'
import { Filter, X } from 'lucide-react'

const MenProductsClient = ({ initialProducts, categories }) => {
  const [selectedFilters, setSelectedFilters] = useState([])
  const [showFilters, setShowFilters] = useState(false)

  // Handle filter changes
  const handleFilterChange = (categoryName, subcategory = null, clearAll = false) => {
    if (clearAll) {
      setSelectedFilters([])
      return
    }

    setSelectedFilters(prev => {
      const filterExists = prev.some(
        filter => 
          filter.category === categoryName && 
          filter.subcategory === subcategory
      )

      if (filterExists) {
        // Remove filter if it already exists
        return prev.filter(
          filter => 
            !(filter.category === categoryName && filter.subcategory === subcategory)
        )
      } else {
        // Add new filter
        return [...prev, { category: categoryName, subcategory }]
      }
    })
  }

  // Filter products based on selected filters
  const filteredProducts = useMemo(() => {
    if (selectedFilters.length === 0) {
      return initialProducts
    }

    return initialProducts.filter(product => {
      return selectedFilters.some(filter => {
        // Check if product matches the filter
        if (filter.subcategory) {
          // Match both category and subcategory
          return (
            product.category?.toLowerCase() === filter.category?.toLowerCase() &&
            product.subcategory?.toLowerCase() === filter.subcategory?.toLowerCase()
          )
        } else {
          // Match only category
          return product.category?.toLowerCase() === filter.category?.toLowerCase()
        }
      })
    })
  }, [initialProducts, selectedFilters])

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Mobile Filter Toggle Button */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="lg:hidden fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-cyan-500 text-white rounded-full shadow-lg hover:bg-cyan-600 transition-colors"
      >
        <Filter className="w-5 h-5" />
        <span className="font-medium">Filters</span>
        {selectedFilters.length > 0 && (
          <span className="ml-1 px-2 py-0.5 bg-white text-cyan-500 text-xs rounded-full font-bold">
            {selectedFilters.length}
          </span>
        )}
      </button>

      {/* Filter Sidebar - Desktop & Mobile Overlay */}
      <div className={`
        fixed lg:static inset-0 z-40 lg:z-0
        ${showFilters ? 'block' : 'hidden lg:block'}
      `}>
        {/* Overlay for mobile */}
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50"
          onClick={() => setShowFilters(false)}
        />
        
        {/* Sidebar */}
        <div className="fixed lg:static left-0 top-0 h-full lg:h-auto w-80 lg:w-64 bg-white lg:rounded-lg shadow-xl lg:shadow-sm overflow-y-auto z-50">
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
            <button
              onClick={() => setShowFilters(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <FilterSidebar
            categories={categories}
            selectedFilters={selectedFilters}
            onFilterChange={(category, subcategory, clearAll) => {
              handleFilterChange(category, subcategory, clearAll)
              // Close mobile filter on selection
              if (window.innerWidth < 1024) {
                setShowFilters(false)
              }
            }}
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="flex-1">
        {/* Active Filters Display */}
        {selectedFilters.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            <span className="text-sm text-gray-600 font-medium">Active Filters:</span>
            {selectedFilters.map((filter, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 bg-cyan-100 text-cyan-700 text-sm rounded-full"
              >
                {filter.subcategory ? filter.subcategory : filter.category}
                <button
                  onClick={() => handleFilterChange(filter.category, filter.subcategory)}
                  className="ml-1 hover:text-cyan-900"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Products Count */}
        <p className="text-sm text-gray-600 mb-4">
          Showing {filteredProducts?.length || 0} products
        </p>

        {/* Products Grid */}
        {filteredProducts && filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {filteredProducts.map((item) => (
              <Products product={item} key={item._id} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No products found matching your filters.</p>
            <button
              onClick={() => setSelectedFilters([])}
              className="mt-4 px-6 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default MenProductsClient
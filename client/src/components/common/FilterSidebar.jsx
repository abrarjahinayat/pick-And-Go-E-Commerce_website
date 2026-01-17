'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'

const FilterSidebar = ({ categories, selectedFilters, onFilterChange }) => {
  const [expandedCategories, setExpandedCategories] = useState({})

  // Safety check for categories
  if (!categories || !Array.isArray(categories) || categories.length === 0) {
    return (
      <aside className="w-full lg:w-64 bg-white rounded-lg shadow-sm border border-gray-200 p-4 h-fit sticky top-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
        <p className="text-sm text-gray-500">No filters available</p>
      </aside>
    )
  }

  const toggleCategory = (categoryName) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryName]: !prev[categoryName]
    }))
  }

  const handleFilterClick = (categoryName, subcategory = null) => {
    onFilterChange(categoryName, subcategory)
  }

  const isSelected = (categoryName, subcategory = null) => {
    if (subcategory) {
      return selectedFilters.some(
        filter => filter.category === categoryName && filter.subcategory === subcategory
      )
    }
    return selectedFilters.some(
      filter => filter.category === categoryName && !filter.subcategory
    )
  }

  return (
    <aside className="w-full lg:w-64 bg-white rounded-lg shadow-sm border border-gray-200 p-4 h-fit sticky top-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
      
      <div className="space-y-1">
        {categories?.map((category) => {
          // Flexible field extraction - handles different API property names
          const categoryId = category._id || category.id
          const categoryName = category.name || category.categoryName || category.category || category.title
          const subcategories = category.subcategories || category.subCategories || category.items || []
          const categoryCount = category.count || category.productCount || 0
          const categoryIcon = category.icon
          
          return (
            <div key={categoryId} className="border-b border-gray-100 last:border-b-0">
              {/* Main Category */}
              <div className="py-2">
                <button
                  onClick={() => toggleCategory(categoryName)}
                  className="flex items-center justify-between w-full text-left group"
                >
                  <div className="flex items-center gap-2">
                    {subcategories && subcategories.length > 0 && (
                      expandedCategories[categoryName] ? (
                        <ChevronDown className="w-4 h-4 text-cyan-500" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-cyan-500" />
                      )
                    )}
                    <span 
                      className={`text-sm font-medium cursor-pointer ${
                        isSelected(categoryName) 
                          ? 'text-cyan-500' 
                          : 'text-gray-700 group-hover:text-cyan-500'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleFilterClick(categoryName)
                      }}
                    >
                      {categoryName}
                    </span>
                    {categoryIcon && <span className="text-yellow-400">{categoryIcon}</span>}
                  </div>
                  <span className="text-xs text-gray-500">{categoryCount}</span>
                </button>

                {/* Subcategories */}
                {expandedCategories[categoryName] && subcategories && subcategories.length > 0 && (
                  <div className="ml-6 mt-2 space-y-1">
                    {subcategories.map((sub) => {
                      const subId = sub._id || sub.id
                      const subName = sub.name || sub.subcategoryName || sub.subcategory || sub.title
                      const subCount = sub.count || sub.productCount || 0
                      
                      return (
                        <button
                          key={subId}
                          onClick={() => handleFilterClick(categoryName, subName)}
                          className={`flex items-center justify-between w-full text-left py-1.5 px-2 rounded hover:bg-gray-50 transition-colors ${
                            isSelected(categoryName, subName) ? 'bg-cyan-50' : ''
                          }`}
                        >
                          <span 
                            className={`text-sm ${
                              isSelected(categoryName, subName)
                                ? 'text-cyan-500 font-medium'
                                : 'text-gray-600'
                            }`}
                          >
                            {subName}
                          </span>
                          <span className="text-xs text-gray-500">{subCount}</span>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Clear Filters Button */}
      {selectedFilters.length > 0 && (
        <button
          onClick={() => onFilterChange(null, null, true)}
          className="mt-4 w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded transition-colors"
        >
          Clear All Filters
        </button>
      )}
    </aside>
  )
}

export default FilterSidebar
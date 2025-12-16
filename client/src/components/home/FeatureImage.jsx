"use client"
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Link from 'next/link'
import Container from '../common/Container'

const FeatureImage = () => {
  const [featureImages, setFeatureImages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API}/featureimg/getallfeatureimg`, { cache: 'no-store' })
      .then((res) => {
        setFeatureImages(res?.data?.data ?? [])
        console.log("Feature Images:", res?.data?.data)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Feature Image Load Error:", err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <Container>
          <div className="animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, index) => (
                <div key={index}>
                  <div className="bg-gray-300 rounded-xl h-96 mb-4"></div>
                  <div className="bg-gray-300 h-6 rounded w-2/3 mx-auto"></div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>
    )
  }

  return (
    <section className="py-16 bg-white">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-15">
          {featureImages.map((feature, index) => (
            <Link
              href={feature?.link || '#'}
              key={feature?._id || index}
              className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105"
            >
              {/* Image Container */}
              <div className="relative  overflow-hidden bg-gray-100">
                {feature?.image ? (
                  <img
                    src={feature.image}
                    alt={feature?.title || 'Feature'}
                    className="w-full h-full group-hover:scale-110 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                    <span className="text-6xl">🖼️</span>
                  </div>
                )}

                {/* Overlay gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Title overlay at bottom */}
                <div className="absolute -bottom-5 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  <div className=" rounded-lg px-6 py-4 ">
                    <h3 className="text-xl font-fjalla text-white font-bold text-gray-900 text-center group-hover:text-blue-600 transition-colors duration-300">
                      {feature?.title || 'Feature Title'}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Hover indicator */}
              {/* <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </div>
              </div> */}
            </Link>
          ))}
        </div>
      </Container>
    </section>
  )
}

export default FeatureImage
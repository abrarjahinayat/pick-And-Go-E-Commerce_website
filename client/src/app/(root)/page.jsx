import Banner from '@/components/home/Banner'
import Category from '@/components/home/Cetagory'
import FeatureImage from '@/components/home/FeatureImage'
import FeatureProducts from '@/components/home/FeatureProducts'

import React from 'react'

const page = () => {
  return (
    <div>
        <Banner/>
        <Category/>
        <FeatureProducts/>
        <FeatureImage/>
    </div>
  )
}

export default page
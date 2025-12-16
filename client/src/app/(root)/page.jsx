import Banner from '@/components/home/Banner'
import Category from '@/components/home/Cetagory'
import Comfort from '@/components/home/Comfort'
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
        <Comfort/>
    </div>
  )
}

export default page
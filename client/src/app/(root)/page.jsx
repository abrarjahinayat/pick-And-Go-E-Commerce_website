import Banner from '@/components/home/Banner'
import Category from '@/components/home/Cetagory'
import Comfort from '@/components/home/Comfort'
import FeatureImage from '@/components/home/FeatureImage'
import FeatureProducts from '@/components/home/FeatureProducts'
import KurtiTopsSection from '@/components/home/KurtiTopsSection'
import PoloSection from '@/components/home/PoloSection'

import React from 'react'

const page = () => {
  return (
    <div>
        <Banner/>
        <Category/>
        <FeatureProducts/>
        <FeatureImage/>
        <Comfort/>
        <PoloSection/>
        <KurtiTopsSection/>
    </div>
  )
}

export default page
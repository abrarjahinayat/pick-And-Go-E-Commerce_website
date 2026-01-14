import AccessoriesFeatureImg from '@/components/home/AccessoriesFeatureImg'
import Banner from '@/components/home/Banner'
import CargoDenimSection from '@/components/home/CargoDenimSection'
import Category from '@/components/home/Cetagory'
import Comfort from '@/components/home/Comfort'
import FeatureImage from '@/components/home/FeatureImage'
import FeatureImage2 from '@/components/home/FeatureImage2'
import FeatureImage3 from '@/components/home/FeatureImages3'
import FeatureProducts from '@/components/home/FeatureProducts'
import KurtiTopsSection from '@/components/home/KurtiTopsSection'
import PanjabiSection from '@/components/home/PanjabiSection'
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
        <FeatureImage2/>
        <PanjabiSection/>
        <FeatureImage3/>
        <CargoDenimSection/>
        <AccessoriesFeatureImg/>
    </div>
  )
}

export default page
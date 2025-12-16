import React from 'react'
import Container from '../common/Container'
import comfort from '../../../public/638b1d9333f59.png'
import Image from 'next/image'
const Comfort = () => {
  return (
    <section className='pb-10'><Container>
        <div className='flex items-center justify-between'>
            <div>
                <h1 className='text-4xl font-bold'>Pick & Go</h1>
                <h3 className='text-2xl text-gray-600 font-medium'>Because comfort and confidence go hand in hand.</h3>
                <p className='text-gray-600 text-sm w-2xl'>We focus on carefully selecting the best clothing that is comfortable, looks great, and makes you confident. Apart from the fabric, design and fit, we go through strict quality control parameters to give you what you truly deserve. The power of a good outfit is how it can influence your perception of yourself.</p>
            </div>
            <div>
                <Image src={comfort} width={500} height={500} alt="comfort" />
            </div>
        </div>
        </Container>
        </section>
  )
}

export default Comfort
import Header from '@/components/common/Header'
import React from 'react'

const Mainlayout = ({children}) => {
  return (
    <div>
        <Header/>
        {children}
        </div>
  )
}

export default Mainlayout
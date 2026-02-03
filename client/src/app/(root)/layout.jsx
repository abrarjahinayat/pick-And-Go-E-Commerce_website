import Header from '@/components/common/Header'
import React from 'react'
import { Toaster } from "sonner";

const Mainlayout = ({children}) => {
  return (
    <div>
        <Header/>
        {children}
         <Toaster position="top-right" richColors />
        </div>
  )
}

export default Mainlayout
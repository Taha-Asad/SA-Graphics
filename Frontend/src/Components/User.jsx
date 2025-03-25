import React from 'react'
import Pages from './Pages/Pages'
import Footer from './Footer/Footer'
import Navbar from './Navbar/Navbar'
import { BrowserRouter } from 'react-router'

const User = () => {
  return (
    <>
    <BrowserRouter>
    <Navbar/>

    </BrowserRouter>
    {/* <Pages/>
    <Footer/> */}
    </>
  )
}

export default User
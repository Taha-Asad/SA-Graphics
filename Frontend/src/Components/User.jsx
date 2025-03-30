import React from 'react'
import Pages from './Pages/Pages'
import Footer from './Footer/Footer'
import Navbar from './Navbar/Navbar'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './authentication/Login'
import Register from './authentication/Register'

const User = () => {
  return (
    <>
    <BrowserRouter>
    <Navbar/>
    <Routes>
      <Route path='/'element={<Footer/>}></Route>
      <Route path='/Login' element={<Login/>}/>
      <Route path='/Register' element={<Register/>}/>
    </Routes>
    </BrowserRouter>
    {/* <Pages/>
    <Footer/> */}
    </>
  )
}

export default User
import React from 'react'
import "./Nav.css"

import  {Social}  from './Social.jsx'
const Navbar = () => {
  return (
    <>
      <nav className='h-[100vh] bg-[#040B14] w-[24%] overflow-visible fixed overflow-y-scroll' >
        <div className="bg-[url(../../assets/PFP/my-profile-img.jpg)] z-10 w-[133px] h-[130px] border-8 border-[#292F37] absolute top-[4%] left-[28%] right-auto bg-cover bg-center rounded-full">
        </div>
        {/* Name for the user */}
        <h1 className='text-white text-[25px] font-bold relative nav-head '>Alex Smith</h1>
      {/* social links */}
      <div className="social-links">
        {Social.map((items , index)=>{
            return(<>
            <li className={items.cName} key={index}>
                <a href={items.url}>{items.icon}</a>
            </li>
            </>)
        })}
      </div>
      </nav>
    </>
  )
}

export default Navbar
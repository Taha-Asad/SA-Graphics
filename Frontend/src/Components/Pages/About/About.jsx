import React from 'react'
import image from "/assets/PFP/my-profile-img.jpg"
import { IoIosArrowForward } from "react-icons/io";

import "./about.css"
const About = () => {
  return (
    <>
    <div className="container relative top-14 bottom-36">
    <h1 className='text-4xl absolute left-5 font-bold'>About</h1>
    <p className='absolute top-24 left-5'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid eligendi, enim nobis eum harum quibusdam facilis magnam iusto hic provident praesentium voluptatem officia quod quis quidem laboriosam ipsum ipsa eius tenetur eveniet! Voluptate placeat, perferendis possimus repellat voluptas a quasi deserunt, in, quia expedita rerum. Totam ex quam minima excepturi.</p>
    <div className="flex absolute top-52 left-5">
        <img src={image} width={"30%"} className='' alt="" />
        <div>
            <h2 className='text-3xl absolute left-82 font-bold'>UI/UX Designer & Web Developer.
            </h2>
            <p className='italic para'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <div className="flex content-table ">
                <div className="content flex flex-col col-1">
                  <span className='info'><IoIosArrowForward className='inline  text-[#149ddd] '/><b>Birthday: </b>27 Feb, 2007</span>
                  <span className='info'><IoIosArrowForward className='inline  text-[#149ddd]'/><b>Website: </b>www.example.com</span>
                  <span className='info'><IoIosArrowForward className='inline  text-[#149ddd]'/><b>Phone: </b>+92 300 300000</span>
                  <span className='info'><IoIosArrowForward className='inline  text-[#149ddd]'/><b>City: </b>Sialkot</span>
                </div>
                <div className="content flex flex-col col-1">
                <span className='info'><IoIosArrowForward className='inline  text-[#149ddd]'/><b>Age: </b>18</span>
                  <span className='info'><IoIosArrowForward className='inline text-[#149ddd]'/><b>Degree: </b>Intermediate</span>
                  <span className='info'><IoIosArrowForward className='inline text-[#149ddd]'/><b>Email: </b>email@example.com</span>
                  <span className='info'><IoIosArrowForward className='inline text-[#149ddd]'/><b>Freelance: </b>Available</span>
                </div>
            </div>
        </div>
    </div>
    </div>
    </>
  )
}

export default About

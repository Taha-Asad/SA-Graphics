import React from 'react'
import image from "/assets/PFP/my-profile-img.jpg"
const About = () => {
  return (
    <>
    <div className="container relative top-14 bottom-36">
    <h1 className='text-4xl absolute left-5 font-bold'>About</h1>
    <p className='absolute top-24 left-5'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid eligendi, enim nobis eum harum quibusdam facilis magnam iusto hic provident praesentium voluptatem officia quod quis quidem laboriosam ipsum ipsa eius tenetur eveniet! Voluptate placeat, perferendis possimus repellat voluptas a quasi deserunt, in, quia expedita rerum. Totam ex quam minima excepturi.</p>
    <div className="flex absolute top-52 left-5">
        <img src={image} width={"40%"} className='' alt="" />
        <div>
            <h2></h2>
            <p>
            </p>
            <div className="flex">
                <div className="content"></div>
                <div className="content"></div>
            </div>
        </div>
    </div>
    </div>
    </>
  )
}

export default About
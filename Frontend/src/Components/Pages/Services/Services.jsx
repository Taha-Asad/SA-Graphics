import React from 'react'
import { ServicesList } from './servicesList'
import './service.css'
const Services = () => {
    return (
        <><div className='container relative top-96'>
                <h1 className='text-4xl absolute left-5 font-bold bottom-20 top-10 section-title'>Services</h1>
            <div className="cards absolute grid grid-cols-3 left-5 right-5 gap-4 top-36">
                {ServicesList.map((list, index) => {
                    return (
                        <>
                            <div className={list.cName}>
                                <div className="flex h-[130%]" key={index}>
                                    <span>{list.icon}</span>
                                    <div className="content">
                                        <h2 className='font-bold text-[19px] ml-9 mt-10'>{list.title}</h2>
                                        <p>{list.description}</p>
                                    </div>
                                </div>
                            </div>
                        </>
                    )
                })}
            </div>
        </div></>
    )
}

export default Services
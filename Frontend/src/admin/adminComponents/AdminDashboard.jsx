// import React, { useState } from 'react'
// import { FaBars } from 'react-icons/fa6';
// import AdminSidebar from './AdminSideBar';
// import { Outlet } from 'react-router';


// const AdminDashboard = () => {
//     const [isSideBarOpen, setIsSideBarOpen] = useState(false);
//     const toggleSideBar = () => {
//         setIsSideBarOpen(!isSideBarOpen);
//     }

//     return (
//         <>
//             <div className="min-h-screen flex flex-col md:flex-row relative">
//                 {/* Mobile Toggle btn */}
//                 <div className="flex md:hidden p-4 bg-[#040B14] text-amber-50 z-20">
//                     <button onClick={toggleSideBar}><FaBars size={'24px'} />
//                     </button>
//                     <h1 className='ml-4 text-xl font-medium'>Admin Dashboard</h1>
//                 </div>
//                 {isSideBarOpen && (
//                     <div className='fixed inset-0 z-10 bg[#040b14] bg-opacity-50 md:hidden' onClick={toggleSideBar}>
//                     </div>
//                 )}
//                 {/* side bar */}
//                 <div className={`bg-[#149ddd] w-64 min-h-screen text-white absolute md:relative transform ${isSideBarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 md:translate-x-0 md:static md:block z-20`}>
//                     <AdminSidebar />
//                 </div>
//                 {/* Main-content */}
//                 <div className="flex-grow overflow-auto p-6">
//                     <Outlet/>
//                 </div>
//             </div>
//         </>
//     )
// }

// export default AdminDashboard
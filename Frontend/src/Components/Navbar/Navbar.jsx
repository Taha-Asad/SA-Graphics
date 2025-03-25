import React, { useContext, useEffect, useState } from 'react';
import "./Nav.css";
import { Social } from './Social.jsx';
import { Links } from './Links.jsx';
import { MdMenu, MdOutlineAccountCircle } from 'react-icons/md';
import { CiShoppingCart } from 'react-icons/ci';
import { AuthContext } from '../../context/AuthContext.jsx';
import AuthModal from './user/AuthModal.jsx';

const Navbar = () => {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const [sectionRefs, setSectionRefs] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    const refs = {};
    Links.forEach((link) => {
      refs[link.id] = document.getElementById(link.id);
    });
    setSectionRefs(refs);
  }, []);

  const scrollToSection = (id) => {
    if (sectionRefs[id]) {
      sectionRefs[id].scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <div className="nav bg-[#040B14] absolute w-full h-[22%] z-20 flex flex-row items-center align-middle">
        <div className="bg-[url(../../assets/PFP/my-profile-img.jpg)] z-50 w-[100px] h-[100px] border-8 border-[#292F37] bg-cover bg-center rounded-full relative left-10"></div>
        <div className="title">
          <h1>
            <span className='text-white text-[27px] font-bold relative left-14 -top-2'>SHERAZ</span>
            <span className='text-amber-300 text-xl font-semibold relative top-3 -left-3'>AMJAD</span>
          </h1>
        </div>
        <div className="hidden md:flex relative left-28">
          {Links.map((link) => (
            <li key={link.id} onClick={() => scrollToSection(link.id)} className={link.cName}>
              <span className='text'>{link.title}</span>
            </li>
          ))}
        </div>
        <div className="page-icons hidden md:flex relative left-46 text-white">
          {user ? (
            <div className="flex items-center gap-4">
              {user.profilePic ? (
                <img src={user.profilePic} alt="Profile" className="w-8 h-8 rounded-full cursor-pointer" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold cursor-pointer">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              <button onClick={logout} className="text-white text-sm hover:text-amber-300">Logout</button>
            </div>
          ) : (
            <MdOutlineAccountCircle size={'29px'} className='left-8 -top-3 absolute cursor-pointer' onClick={() => setIsModalOpen(true)} />
          )}
          <CiShoppingCart size={'29px'} className='left-20 -top-3 absolute cursor-pointer' />
        </div>
        <div className="menu relative left-[50%]">
          <button className='md:hidden' onClick={() => setIsSideBarOpen(!isSideBarOpen)}>
            <MdMenu className='text-white bg-black' size={'22px'} />
          </button>
        </div>
      </div>

      {isSideBarOpen && (
        <div className='fixed inset-0 z-10 bg-[#040b14] bg-opacity-50 md:hidden' onClick={() => setIsSideBarOpen(false)}></div>
      )}

      <div className={`w-64 min-h-screen md:hidden text-white h-[100vh] bg-[#040B14] overflow-x-hidden overflow-y-scroll absolute transform ${isSideBarOpen ? "translate-x-0" : "translate-x-full"} right-0 transition-transform duration-300 z-10`}>
        <nav className='top-40 relative'>
          <div className="social-links relative">
            {Social.map((items, index) => (
              <li className={items.cName} key={index}>
                <a href={items.url}>{items.icon}</a>
              </li>
            ))}
          </div>
          <div className="Page-Links">
            {Links.map((link) => (
              <li key={link.id} onClick={() => scrollToSection(link.id)} className={link.cName}>
                {link.icon} <span className='text'>{link.title}</span>
              </li>
            ))}
          </div>
        </nav>
      </div>

      {isModalOpen && <AuthModal onClose={() => setIsModalOpen(false)} />}
    </>
  );
};

export default Navbar;

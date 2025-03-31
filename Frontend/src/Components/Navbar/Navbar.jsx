import React, { useState } from 'react';
import "./Nav.css";
import { Box, Button, Container, Link, Stack } from '@mui/material';
import { Social } from './Social.jsx';
import { Links } from './Links.jsx';
import { MdClose, MdMenu, MdOutlineAccountCircle } from 'react-icons/md';
import { CiShoppingCart } from 'react-icons/ci';
import { AuthContext } from '../../context/AuthContext.jsx';
import pfp from "../../../public/assets/PFP/my-profile-img.jpg"
import AccountSideBar from './user/AccountSideBar.jsx';
import { Link as ScrollLink } from "react-scroll"; // Import react-scroll Link

const Navbar = () => {
  // const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  // const [sectionRefs, setSectionRefs] = useState({});
  // const [isModalOpen, setIsModalOpen] = useState(false);
  // const { user, logout } = useContext(AuthContext);
  const [userSideBar, setUserSideBar] = useState(false);
  setTimeout(()=>{
    setUserSideBar(false);
  }, 5000)
  // useEffect(() => {
  //   const refs = {};
  //   Links.forEach((link) => {
  //     refs[link.id] = document.getElementById(link.id);
  //   });
  //   setSectionRefs(refs);
  // }, []);

  // const scrollToSection = (id) => {
  //   if (sectionRefs[id]) {
  //     sectionRefs[id].scrollIntoView({ behavior: 'smooth' });
  //   }
  // };

  return (
    // <>
    //   <div className="nav bg-[#040B14] absolute w-full h-[22%] z-20 flex flex-row items-center align-middle">
    //     <div className="bg-[url(../../assets/PFP/my-profile-img.jpg)] z-50 w-[100px] h-[100px] border-8 border-[#292F37] bg-cover bg-center rounded-full relative left-10"></div>
    //     <div className="title">
    //       <h1>
    //         <span className='text-white text-[27px] font-bold relative left-14 -top-2'>SHERAZ</span>
    //         <span className='text-amber-300 text-xl font-semibold relative top-3 -left-3'>AMJAD</span>
    //       </h1>
    //     </div>
    //     <div className="hidden md:flex relative left-28">
    //       {Links.map((link) => (
    //         <li key={link.id} onClick={() => scrollToSection(link.id)} className={link.cName}>
    //           <span className='text'>{link.title}</span>
    //         </li>
    //       ))}
    //     </div>
    //     <div className="page-icons hidden md:flex relative left-46 text-white">
    //       {user ? (
    //         <div className="flex items-center gap-4">
    //           {user.profilePic ? (
    //             <img src={user.profilePic} alt="Profile" className="w-8 h-8 rounded-full cursor-pointer" />
    //           ) : (
    //             <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold cursor-pointer">
    //               {user.name.charAt(0).toUpperCase()}
    //             </div>
    //           )}
    //           <button onClick={logout} className="text-white text-sm hover:text-amber-300">Logout</button>
    //         </div>
    //       ) : (
    //         <MdOutlineAccountCircle size={'29px'} className='left-8 -top-3 absolute cursor-pointer' onClick={() => setIsModalOpen(true)} />
    //       )}
    //       <CiShoppingCart size={'29px'} className='left-20 -top-3 absolute cursor-pointer' />
    //     </div>
    //     <div className="menu relative left-[50%]">
    //       <button className='md:hidden' onClick={() => setIsSideBarOpen(!isSideBarOpen)}>
    //         <MdMenu className='text-white bg-black' size={'22px'} />
    //       </button>
    //     </div>
    //   </div>

    //   {isSideBarOpen && (
    //     <div className='fixed inset-0 z-10 bg-[#040b14] bg-opacity-50 md:hidden' onClick={() => setIsSideBarOpen(false)}></div>
    //   )}

    //   <div className={`w-64 min-h-screen md:hidden text-white h-[100vh] bg-[#040B14] overflow-x-hidden overflow-y-scroll absolute transform ${isSideBarOpen ? "translate-x-0" : "translate-x-full"} right-0 transition-transform duration-300 z-10`}>
    //     <nav className='top-40 relative'>
    //       <div className="social-links relative">
    //         {Social.map((items, index) => (
    //           <li className={items.cName} key={index}>
    //             <a href={items.url}>{items.icon}</a>
    //           </li>
    //         ))}
    //       </div>
    //       <div className="Page-Links">
    //         {Links.map((link) => (
    //           <li key={link.id} onClick={() => scrollToSection(link.id)} className={link.cName}>
    //             {link.icon} <span className='text'>{link.title}</span>
    //           </li>
    //         ))}
    //       </div>
    //     </nav>
    //   </div>

    //   {isModalOpen && <AuthModal onClose={() => setIsModalOpen(false)} />}
    // </>
    <>
      <Box sx={{ width: "100%", height: "23vh", bgcolor: "#040B14", position: 'absolute' }}>
        <Container >
          <Stack direction={'row'} pt={"20px"} alignContent={"center"} >
            <Box sx={{
              width: "90px", borderRadius: "100px", height: "90px", borderStyle: 'solid', borderWidth: "6px",
              borderColor: "#292F37", backgroundImage: `url(${pfp})`, backgroundPosition: "center", backgroundSize: "contain", backgroundRepeat: "no-repeat"
            }}>
              <h1>
                <span className='fName'>SHERAZ</span>
                <span className='lName'>AMJAD</span>
              </h1>
            </Box>
            <Box ml={"125px"} pt={"10px"} pl={"100px"} zIndex={1000}>
              {Links.map((link) => (
                <ScrollLink
                  key={link.id}
                  to={link.to} // Scroll to section
                  spy={true} // Highlights when active
                  smooth={true} // Enables smooth scrolling
                  offset={-70} // Prevents overlap if navbar is sticky
                  duration={500} // Scroll duration in milliseconds
                >
                  <Link
                    underline="none"
                    sx={{
                      color: "#fff",
                      mt: "20px",
                      position: "relative",
                      pl: "20px",
                      fontSize: "18px",
                      cursor: "pointer", // Ensures it looks clickable
                      textDecoration: "none",
                    }}
                    className={link.cName}
                  >
                    {link.title}
                  </Link>
                </ScrollLink>
              ))}
            </Box>
            <Box sx={{
              mt: "20px",
              ml: "90px"
            }}>
              {/* User Panel */}
              <Button sx={{
                zIndex: 1000
              }} onClick={() => {
                console.log("button is clicked");
                setUserSideBar(!userSideBar);
              }}>
                <MdOutlineAccountCircle color='white' fontSize={"33px"} />
              </Button>
            </Box>
          </Stack>
        </Container>
      </Box>
      {userSideBar &&
        (<Box
          className={`md:hidden`} // Tailwind class added here
          sx={{
            position: "fixed",
            inset: 0,
            opacity: 0.5,
            zIndex: 30,
          }} onClick={() => setUserSideBar(false)}>
        </Box>)}
      <Box
        sx={{
          width: "25%",
          height: "100vh",
          overflowX: "hidden",
          position: "fixed",   // Keep it fixed for proper overlay
          backgroundColor: "#1e242c",
          color: "white",
          right: 0,
          transform: `${userSideBar ? "translateX(0)" : "translateX(100%)"}`,
          transition: "transform 0.5s ease-in-out, opacity 0.5s ease-in-out",
          opacity: userSideBar ? 1 : 0,
          visibility: userSideBar ? "visible" : "hidden",
          zIndex: 9999,  // Increase to make sure it's above the Navbar
        }}
      >

        <Box sx={{
          transition: "all 0.5s ease-in-out",
        }}>
          <AccountSideBar />
          <Button
            sx={{
              zIndex: 50,
              color: "white",
              fontSize: "30px",
              mt: "30px",
            }}
            onClick={() => setUserSideBar(false)}
          >
            <MdClose />
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default Navbar;

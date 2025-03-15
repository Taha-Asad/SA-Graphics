import { IoHomeOutline } from "react-icons/io5";
import { IoPersonOutline } from "react-icons/io5";
import { GrDocumentText } from "react-icons/gr";
import { IoImagesOutline } from "react-icons/io5";
import { CiServer } from "react-icons/ci";
import { MdOutlineMessage } from "react-icons/md";
import { MdOutlineEmail } from "react-icons/md";

export const Links = [
    {
        title:'Home',
        id: "home",
        cName:"nav-links",
        icon: <IoHomeOutline className="page-links"/>
    },
    {
        title:'About',
        id: "about",
        cName:"nav-links",
        icon: <IoPersonOutline className="page-links"/>
    },
    {
        title:'Resume',
        id: "resume",
        cName:"nav-links",
        icon: <GrDocumentText className="page-links"/>
    },
    {
        title:'Portfolio',
        id: "portfolio",
        cName:"nav-links",
        icon: <IoImagesOutline className="page-links"/>,
        submenu:[
            {   title:'Projects',
                id: "projects",
                cName:"nav-links",
                icon: <IoImagesOutline className="page-links"/>,
            },
            {
                title:'Books',
                id: "book",
                cName:"nav-links",
                icon: <IoImagesOutline className="page-links"/>,
            }
        ]
    },
    {
        title:'Services',
        id: "services",
        cName:"nav-links",
        icon: <CiServer className="page-links"/>
    },
    {
        title:'Testimonials',
        id: "testimonials",
        cName:"nav-links",
        icon: <MdOutlineMessage className="page-links"/>
    },
    {
        title:'Contact',
        id: "contact",
        cName:"nav-links",
        icon: <MdOutlineEmail className="page-links"/>
    },

]


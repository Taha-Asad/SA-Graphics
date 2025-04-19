import { IoHomeOutline } from "react-icons/io5";
import { IoPersonOutline } from "react-icons/io5";
import { IoImagesOutline } from "react-icons/io5";
import { CiServer } from "react-icons/ci";
import { MdOutlineMessage } from "react-icons/md";
import { MdOutlineEmail } from "react-icons/md";
import { IoSchoolOutline } from "react-icons/io5";

export const Links = [
    {
        title: 'Home',
        id: "home",
        to: "home",
        cName: "nav-links",
        icon: <IoHomeOutline className="page-links"/>
    },
    {
        title: 'About',
        id: "about",
        to: "about",
        cName: "nav-links",
        icon: <IoPersonOutline className="page-links"/>
    },
    {
        title: 'Portfolio',
        id: "portfolio",
        to: "portfolio",
        cName: "nav-links",
        icon: <IoImagesOutline className="page-links"/>
    },
    {
        title: 'Services',
        id: "services",
        to: "services",
        cName: "nav-links",
        icon: <CiServer className="page-links"/>
    },
    {
        title: 'Courses',
        id: "courses",
        to: "courses",
        cName: "nav-links",
        icon: <IoSchoolOutline className="page-links"/>
    },
    {
        title: 'Reviews',
        id: "testimonials",
        to: "testimonials",
        cName: "nav-links",
        icon: <MdOutlineMessage className="page-links"/>
    },
    {
        title: 'Contact',
        id: "contact",
        to: "contact",
        cName: "nav-links",
        icon: <MdOutlineEmail className="page-links"/>
    }
];


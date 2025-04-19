import { MdFacebook } from "react-icons/md";
import { FaXTwitter } from "react-icons/fa6";
import { IoLogoInstagram } from "react-icons/io5";
import { FaLinkedin } from "react-icons/fa";
import { FaSquareWhatsapp } from "react-icons/fa6";

export const Social = [
    {
        icon: <FaXTwitter className="icon"/>,
        url: "https://twitter.com/sagraphics",
        title: "Follow us on Twitter",
        cName: "social-icons"
    },
    {
        icon: <MdFacebook className="icon"/>,
        url: "https://facebook.com/sagraphics",
        title: "Like us on Facebook",
        cName: "social-icons"
    },
    {
        icon: <FaSquareWhatsapp className="icon"/>,
        url: "https://wa.link/4g9blc",
        title: "Message us on WhatsApp",
        cName: "social-icons"
    },
    {
        icon: <IoLogoInstagram className="icon"/>,
        url: "https://instagram.com/sagraphics",
        title: "Follow us on Instagram",
        cName: "social-icons"
    },
    {
        icon: <FaLinkedin className="icon"/>,
        url: "https://linkedin.com/company/sagraphics",
        title: "Connect with us on LinkedIn",
        cName: "social-icons"
    }
];
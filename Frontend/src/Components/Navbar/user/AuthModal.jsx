import React, { useState } from "react";
import { useNavigate } from "react-router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdClose, MdVisibility, MdVisibilityOff } from "react-icons/md";

const url = "http://localhost:5000/api/register";

const AuthModal = ({ onClose }) => {
  const [postUser, setPostUser] = useState({
    name: "",
    email: "",
    phoneNo: "",
    password: "",
    confirmPassword: "",
    profilePic: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setPostUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPostUser((prev) => ({ ...prev, profilePic: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const getInitials = (name) => {
    if (!name.trim()) return "";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!postUser.name || !postUser.email || !postUser.phoneNo || !postUser.password || !postUser.confirmPassword) {
      toast.error("All fields must be filled");
      return;
    }
    
    if (postUser.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    
    if (postUser.password !== postUser.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    if (postUser.phoneNo.length < 11) {
      toast.error("Phone number is invalid");
      return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(postUser.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postUser),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Registration failed");
      }

      toast.success("Account created successfully!");
      setTimeout(() => {
        navigate("/getUser");
        onClose();
      }, 2000);
    } catch (error) {
      toast.error(error.message || "Registration failed. Please try again!");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 relative flex flex-col items-center max-h-[90vh] overflow-y-auto">
        <button 
          className="absolute top-3 right-3 text-gray-500 hover:text-black transition-colors"
          onClick={onClose}
          aria-label="Close modal"
        >
          <MdClose size={24} />
        </button>

        <h1 className="text-2xl font-bold mb-4">Sign Up</h1>

        {/* Profile Picture Upload */}
        <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center mb-4 border-2 border-gray-300">
          {postUser.profilePic ? (
            <img 
              src={postUser.profilePic} 
              alt="Profile" 
              className="w-full h-full object-cover" 
            />
          ) : (
            <span className="text-2xl font-semibold text-gray-600">
              {getInitials(postUser.name)}
            </span>
          )}
        </div>
        
        <label className="cursor-pointer mb-6 px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
          Upload Photo
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageUpload} 
            className="hidden"
          />
        </label>

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input 
              type="text" 
              name="name" 
              placeholder="Enter your name" 
              onChange={handleChange} 
              value={postUser.name} 
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              name="email" 
              placeholder="Enter your email" 
              onChange={handleChange} 
              value={postUser.email} 
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input 
              type="tel" 
              name="phoneNo" 
              placeholder="Enter your phone number" 
              onChange={handleChange} 
              value={postUser.phoneNo} 
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                name="password" 
                placeholder="Enter your password" 
                onChange={handleChange} 
                value={postUser.password} 
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <div className="relative">
              <input 
                type={showConfirmPassword ? "text" : "password"} 
                name="confirmPassword" 
                placeholder="Confirm your password" 
                onChange={handleChange} 
                value={postUser.confirmPassword} 
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={toggleConfirmPasswordVisibility}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <MdVisibilityOff /> : <MdVisibility />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Sign Up
          </button>
        </form>

        <p className="text-sm text-center mt-4 text-gray-600">
          Already have an account?{" "}
          <span 
            className="text-blue-600 cursor-pointer hover:underline" 
            onClick={() => { navigate("/getUser"); onClose(); }}
          >
            Login
          </span>
        </p>
        
        <ToastContainer 
          position="top-center"
          autoClose={2000}
          hideProgressBar
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </div>
  );
};

export default AuthModal;
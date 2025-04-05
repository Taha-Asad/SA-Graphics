import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";

const ProfileIcon = () => {
  const { user } = useContext(AuthContext);
  const [key, setKey] = useState(0);

  useEffect(() => {
    // Force re-render when user data changes
    setKey(prev => prev + 1);
  }, [user]);

  if (!user) return null;

  // Construct the full URL for the profile picture
  const profilePicUrl = user.profilePic
    ? (user.profilePic.startsWith('http') 
        ? user.profilePic 
        : `http://localhost:5000/uploads/${user.profilePic}`)
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`;

  console.log('ProfileIcon rendering with URL:', profilePicUrl);

  return (
    <div 
      style={{ 
        position: "absolute", 
        top: "0px", 
        right: "0px", 
        width: "100%" 
      }}
      key={key}
    >
      <img
        src={profilePicUrl}
        alt={user.name}
        style={{ 
          width: "100%", 
          height: "100%", 
          borderRadius: "50%", 
          objectFit: "cover" 
        }}
        onError={(e) => {
          console.log('ProfileIcon image error, falling back to avatar');
          e.target.onerror = null;
          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`;
        }}
      />
    </div>
  );
};

export default ProfileIcon;
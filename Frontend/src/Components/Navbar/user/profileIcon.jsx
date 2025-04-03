import React, { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";

const ProfileIcon = () => {
  const { user } = useContext(AuthContext);

  if (!user) return null;

  return (
    <div style={{ position: "absolute", top: "0px", right: "0px" , width:"100%"}}>
      {user.profilePic ? (
        <img
          src={user.profilePic.startsWith('http') ? user.profilePic : `http://localhost:5000/${user.profilePic}`}
          alt="Profile"
          style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`;
          }}
        />
      ) : (
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            background: "#ccc",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "18px",
            fontWeight: "bold",
          }}
        >
          {user.name.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );
};

export default ProfileIcon;
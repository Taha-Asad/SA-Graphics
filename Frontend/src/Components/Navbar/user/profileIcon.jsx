import React, { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";

const ProfileIcon = () => {
  const { user, logout } = useContext(AuthContext);

  if (!user) return null;

  return (
    <div style={{ position: "absolute", top: "10px", right: "10px" }}>
      {user.profilePic ? (
        <img
          src={user.profilePic}
          alt="Profile"
          style={{ width: "40px", height: "40px", borderRadius: "50%" }}
        />
      ) : (
        <div
          style={{
            width: "40px",
            height: "40px",
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
      <button onClick={logout} style={{ marginLeft: "10px" }}>
        Logout
      </button>
    </div>
  );
};

export default ProfileIcon;
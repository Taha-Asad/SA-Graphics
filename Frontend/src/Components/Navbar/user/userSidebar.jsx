import React, { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";

const Sidebar = () => {
  const { user } = useContext(AuthContext);

  if (!user) return null;

  return (
    <div style={{ width: "200px", background: "#f4f4f4", padding: "10px" }}>
      <h3>User Sidebar</h3>
      <ul>
        <li>Home</li>
        <li>Profile</li>
        <li>Settings</li>
      </ul>
    </div>
  );
};

export default Sidebar;
// import Admin from "./admin/Admin"

import { useContext } from "react";
import User from "./Components/User"
import "./index.css"
import { AuthContext } from "./context/AuthContext.jsx";

function App() {
  const { user } = useContext(AuthContext);

  console.log("User in App:", user); // ✅ Debugging step

  return (
    <div className="app">
      {user ? (
        user.role === "admin" ? (
          <h1>Hello Admin</h1>
        ) : (
          <User />
        )
      ) : (
        <User />
      )}
    </div>
  );
}


export default App

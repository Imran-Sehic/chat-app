import { useContext } from "react";
import { Toaster } from "react-hot-toast";
import { Navigate, Route, Routes } from "react-router-dom";
import { io } from "socket.io-client";
import "./App.css";
import { AuthContext } from "./context-providers/AuthContext";
import Chat from "./views/Chat";
import Login from "./views/Login";
import Signup from "./views/Signup";

const socket = io(`${process.env.REACT_APP_BACKEND_URL}`);

function App() {
  const { isAuthenticated } = useContext(AuthContext);

  console.log("isAuth", isAuthenticated);

  return (
    <>
      <Routes>
        <Route path="/login" Component={Login} />
        <Route path="/signup" Component={Signup} />
        <Route
          path="/chat"
          element={isAuthenticated ? <Chat /> : <Navigate to="/login" />}
        />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
      <Toaster position="top-right" />
    </>
  );
}

export default App;

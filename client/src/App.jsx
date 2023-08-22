import "./app.css";
import React, { useEffect } from "react";
import Navbar from "./components/navbar/Navbar";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { auth } from './actions/user';
import Registration from "./components/registration/Registration";
import Authorization from "./components/authorization/Authorization";
import Disk from "./components/disk/Disk";

function App() {
  const isAuth = useSelector((state) => state.user.isAuth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(auth());
  }, []);

  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />
        {!isAuth ? (
          <Routes>
            <Route path="/registration" Component={Registration} />
            <Route path="/login" Component={Authorization} />
            <Route path="*" element={<Navigate to="/login" replace/>}/>
          </Routes>
        ) : (
          <Routes>
            <Route exact path="/" Component={Disk}/>
            <Route path="*" element={<Navigate to="/" replace/>} />
          </Routes>
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;

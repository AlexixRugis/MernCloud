import React, { useState } from "react";
import "./navbar.css";
import Logo from "../../assets/img/logo.png";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../reducers/userReducer";
import { clear } from "../../reducers/index";
import { searchFile, getFiles } from "../../actions/file";

const Navbar = () => {
  const isAuth = useSelector((state) => state.user.isAuth);
  const dispatch = useDispatch();
  const currentDir = useSelector((state) => state.file.currentDir);
  const user = useSelector((state) => state.user.currentUser);
  const [searchName, setSearchName] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(false);

  function searchHandler(e) {
    setSearchName(e.target.value);
    if (searchTimeout != false) {
      clearTimeout(searchTimeout);
    }
    if (e.target.value !== "") {
      setSearchTimeout(
        setTimeout(
          (value) => {
            dispatch(searchFile(value));
          },
          500,
          e.target.value
        )
      );
    } else {
      setSearchTimeout(
        setTimeout(() => {
          dispatch(getFiles(currentDir?._id));
        }, 500)
      );
    }
  }

  function logoutHandler() {
    dispatch(logout());
    dispatch(clear());
  }

  return (
    <div className="navbar">
      <div className="container">
        <div className="navbar__container">
          <img src={Logo} alt="" className="navbar__logo" />
          <Link to="/" className="navbar__header">
            MERN CLOUD
          </Link>
          {isAuth && (
            <div className="navbar__search-row">
              <div className="navbar__search-icon" />
              <input
                value={searchName}
                onChange={searchHandler}
                type="text"
                className="navbar__search"
                placeholder="Найти..."
              />
            </div>
          )}
          {!isAuth && (
            <Link to="/login" className="navbar__login">
              Войти
            </Link>
          )}
          {!isAuth && (
            <Link to="/registration" className="navbar__registration">
              Регистрация
            </Link>
          )}
          {isAuth && (
            <div className="navbar__logout" onClick={logoutHandler}>
              Выход из <span className="navbar__username">{user?.email}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;

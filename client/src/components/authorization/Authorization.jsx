import React, { useState } from "react";
import Input from "../../utils/input/input";
import { login } from "../../actions/user";
import { useDispatch } from "react-redux";
import "./authorization.css";

const Registration = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  return (
    <div className="container">
      <div className="authorization">
        <div className="authorization__container">
          <div className="authorization__header">Авторизация</div>
          <Input
            value={email}
            setValue={setEmail}
            type="email"
            placeholder="Почта"
          />
          <Input
            value={password}
            setValue={setPassword}
            type="password"
            placeholder="Пароль"
          />
          <button
            className="authorization__button"
            onClick={() => dispatch(login(email, password))}
          >
            Войти
          </button>
        </div>
      </div>
    </div>
  );
};

export default Registration;

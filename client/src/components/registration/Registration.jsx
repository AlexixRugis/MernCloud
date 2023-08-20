import React, { useState } from "react";
import Input from "../../utils/input/input";
import { registration } from "../../actions/user";
import "./registration.css";

const Registration = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="container">
      <div className="registration">
        <div className="registration__container">
          <div className="registration__header">Регистрация</div>
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
            className="registration__button"
            onClick={() => registration(email, password)}
          >
            Зарегистрироваться
          </button>
        </div>
      </div>
    </div>
  );
};

export default Registration;

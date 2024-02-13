import { useNavigate, Link } from "react-router-dom";
import styles from "./index.module.css";
import { TailSpin } from "react-loader-spinner";

import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";

const url = "https://backendoffinancetracker.onrender.com";

function LoginPage() {
  const [data, setData] = useState({ username: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("auth_token");
    if (token) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const onChangeInput = (event) => {
    setData({ ...data, [event.target.name]: event.target.value });
  };

  const onSuccessfulSubmit = (token) => {
    Cookies.set("auth_token", token);
    navigate("/", { replace: true });
  };

  const onSubmitForm = async (event) => {
    event.preventDefault();
    try {
      setIsLoading(true);
      setErr("");
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      };
      const response = await fetch(`${url}/login`, options);
      const responseData = await response.json();
      if (response.ok) {
        onSuccessfulSubmit(responseData.jwt_token);
      } else {
        setErr(responseData?.msg || "error");
      }
    } catch (error) {
      setErr(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      <h1 className={styles.heading}>
        Finance Web Tracker <br /> App
      </h1>
      <form onSubmit={onSubmitForm} className={styles.formEl}>
        <h3 className={styles.formTitle}>Login</h3>
        <div className={styles.inputContainer}>
          <label htmlFor="username">USERNAME</label>
          <input
            className={styles.input}
            type="text"
            name="username"
            id="username"
            value={data.username}
            onChange={onChangeInput}
          />
        </div>
        <div className={styles.inputContainer}>
          <label htmlFor="password">PASSWORD</label>
          <input
            className={styles.input}
            type="password"
            name="password"
            id="password"
            value={data.password}
            onChange={onChangeInput}
          />
        </div>
        <button
          disabled={isLoading}
          type="submit"
          className={styles.loginButton}>
          {isLoading ? (
            <TailSpin width={18} height={18} color="white" />
          ) : (
            "Login"
          )}
        </button>
        <p className={styles.spPara}>
          Don't have an account?? <Link to="/register">register</Link>
        </p>
        <span className={styles.errSpan}>{err && "*" + err}</span>
      </form>
    </div>
  );
}

export default LoginPage;

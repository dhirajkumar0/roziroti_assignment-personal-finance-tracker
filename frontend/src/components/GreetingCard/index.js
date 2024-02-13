import React, { useCallback, useEffect, useState } from "react";
import styles from "./index.module.css";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

let url = "https://backendoffinancetracker.onrender.com";

function GreetingCard() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState("");

  const getUserProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${url}/get-user-data`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + Cookies.get("auth_token"),
          "Content-Type": "application/json",
        },
      });
      const jsonData = await response.json();
      if (response.ok) {
        setUserData({
          ...jsonData,
          username:
            jsonData.msg?.username[0]?.toUpperCase() +
            jsonData.msg?.username?.slice(1),
        });
      } else {
        setErr(jsonData.msg);
      }
    } catch (error) {
      setErr(error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getUserProfile();
  }, [getUserProfile]);

  const onClickLogout = () => {
    Cookies.remove("auth_token");
    navigate("/login", { replace: true });
  };

  return (
    <div className={styles.greetingContainer}>
      {isLoading ? (
        <>
          <h1 className={styles.greetingTitlePlaceholder}></h1>
          <p className={styles.greetingParaPlaceholder}></p>
        </>
      ) : err ? (
        <h3>{err}</h3>
      ) : (
        <>
          <h1 className={styles.greetingTitle}>
            Hi, {userData?.username}
          </h1>
          <p className={styles.greetingPara}>
            Welcome to <span>Finance Web Tracker App</span>
          </p>
        </>
      )}
      <button className={styles.logoutBtn} onClick={onClickLogout}>
        Logout
      </button>
    </div>
  );
}

export default GreetingCard;

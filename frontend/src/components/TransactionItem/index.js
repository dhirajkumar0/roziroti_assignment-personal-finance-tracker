import { useState } from "react";
import styles from "./index.module.css";
import Cookies from "js-cookie";
import { TailSpin } from "react-loader-spinner";

const url = "https://backendoffinancetracker.onrender.com";

const TransactionItem = (props) => {
  const { transactionDetails, getTransactions, show = true } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState("");
  const {
    id,
    title,
    amount,
    category: type,
    transaction_date: transactionDate,
  } = transactionDetails;

  const onDeleteTransaction = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + Cookies.get("auth_token"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tId: id }),
      });
      const jsonData = await response.json();
      if (response.ok) {
        getTransactions();
      } else {
        setErr(jsonData.msg);
        console.log(jsonData);
      }
    } catch (error) {
      setErr(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const date = new Date(transactionDate);
  const formattedDate = `${date.toLocaleDateString()} ${date.getHours()}:${date.getMinutes()}`;

  return (
    <li className={styles.tableRow}>
      <p className={styles.transactionText}>{title}</p>
      <p className={styles.transactionText}>Rs {amount}</p>
      <p className={styles.transactionText}>{type}</p>
      <p className={styles.transactionText}>{formattedDate}</p>
      {show && (
        <div className={styles.deleteContainer}>
          <button
            className={styles.deleteButton}
            type="button"
            onClick={onDeleteTransaction}>
            {isLoading ? (
              <TailSpin width={18} height={18} color="red" />
            ) : err === "" ? (
              <img
                className={styles.deleteImg}
                src="https://assets.ccbp.in/frontend/react-js/money-manager/delete.png"
                alt="delete"
              />
            ) : (
              "Retry"
            )}
          </button>
        </div>
      )}
    </li>
  );
};

export default TransactionItem;

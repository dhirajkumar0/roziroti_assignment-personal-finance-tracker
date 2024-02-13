import React from "react";
import styles from "./index.module.css";

function BalanceDetailsContainer({ transactionsList, isLoading }) {
  let [income, expenses] = [0, 0];
  transactionsList.forEach((each) => {
    if (each.category === "EXPENSES") expenses += parseInt(each.amount);
    else income += parseInt(each.amount);
  });
  const balance = income - expenses;
  return (
    <div className={styles.balaceDetailsContainer}>
      <div className={styles.balanceContainer}>
        <img
          className={styles.iconImage}
          src="https://assets.ccbp.in/frontend/react-js/money-manager/balance-image.png"
          alt=""
        />
        <div>
          <p className={styles.displayText}>Your Balance</p>
          {isLoading ? (
            <p className={styles.displayMoneyPlaceholder}></p>
          ) : (
            <p className={styles.displayMoney}>Rs {balance}</p>
          )}
        </div>
      </div>
      <div className={styles.incomeContainer}>
        <img
          className={styles.iconImage}
          src="https://assets.ccbp.in/frontend/react-js/money-manager/income-image.png"
          alt=""
        />
        <div>
          <p className={styles.displayText}>Your Income</p>
          {isLoading ? (
            <p className={styles.displayMoneyPlaceholder}></p>
          ) : (
            <p className={styles.displayMoney}>Rs {income}</p>
          )}
        </div>
      </div>
      <div className={styles.expensesContainer}>
        <img
          className={styles.iconImage}
          src="https://assets.ccbp.in/frontend/react-js/money-manager/expenses-image.png"
          alt=""
        />
        <div>
          <p className={styles.displayText}>Your Expenses</p>
          {isLoading ? (
            <p className={styles.displayMoneyPlaceholder}></p>
          ) : (
            <p className={styles.displayMoney}>Rs {expenses}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default BalanceDetailsContainer;

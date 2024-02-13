import Popup from "reactjs-popup";
import styles from "./index.module.css";
import {useState } from "react";
import TransactionItem from "../TransactionItem";


const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
  "Select",
].map((each, index) => ({
  monthName: each,
  monthNo: index,
}));

function PopupButton({ transactionsList }) {
  const [selectedMonth, setSelectedMonth] = useState(12);

  const updateOption = (event) => {
    setSelectedMonth(event.target.value);
  };

  const monthsTransaction = transactionsList.filter((each) => {
    const transactionDate = new Date(each.transaction_date);
    return transactionDate.getMonth().toString() === selectedMonth;
  });


  return (
    <Popup modal trigger={<button>Generate Monthly Report</button>}>
      {(close) => (
        <div className={styles.popupContainer}>
          <select
            className={styles.input}
            value={selectedMonth}
            onChange={updateOption}>
            {months.map((each) => (
              <option value={each.monthNo}>{each.monthName}</option>
            ))}
          </select>
          <div className={styles.transactionsTableContainer}>
            <ul className={styles.transactionsTable}>
              <li className={styles.tableHeader}>
                <p className={styles.tableHeaderCell}>Title</p>
                <p className={styles.tableHeaderCell}>Amount</p>
                <p className={styles.tableHeaderCell}>Type</p>
                <p className={styles.tableHeaderCell}>Date</p>
              </li>
              {monthsTransaction.map((eachTransaction) => (
                <TransactionItem
                  show={false}
                  key={eachTransaction.id}
                  transactionDetails={eachTransaction}
                />
              ))}
            </ul>
            <button className={styles.button} style={{ marginTop: "10px" }}>
              Print
            </button>
          </div>
        </div>
      )}
    </Popup>
  );
}

export default PopupButton;

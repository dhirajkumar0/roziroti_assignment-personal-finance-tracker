import { useEffect, useState } from "react";
import TransactionItem from "../TransactionItem";
import styles from "./index.module.css";
import Cookies from "js-cookie";
import { TailSpin } from "react-loader-spinner";
import BalanceDetailsContainer from "../BalanceDetailsContainer";
import PopupButton from "../../components/PopupButton";

const transactionTypeOptions = [
  {
    optionId: "INCOME",
    displayText: "Income",
  },
  {
    optionId: "EXPENSES",
    displayText: "Expenses",
  },
];

const initialData = { titleInput: "", amountInput: "" };

const url = "https://backendoffinancetracker.onrender.com";

function TransactionDetails() {
  const [data, setData] = useState(initialData);
  const [optionId, setOptionId] = useState(transactionTypeOptions[0].optionId);
  const [transactionsList, setTransactionsList] = useState([]);
  const [errorObject, setErrorObject] = useState({
    getTransactionApiErr: "",
    insertTransactionApiErr: "",
    deleteTransactionApiErr: "",
  });

  const [loadingObject, setIsLoadingObject] = useState({
    getTransactionApiLoading: false,
    insertTransactionApiLoading: false,
    deleteTransactionApiErr: false,
  });

  const getTransactions = async () => {
    try {
      setIsLoadingObject({ ...loadingObject, getTransactionApiLoading: true });
      const token = Cookies.get("auth_token");
      const response = await fetch(`${url}/transaction`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      const jsonData = await response.json();
      if (response.ok) {
        setTransactionsList(jsonData.msg);
      } else {
        setErrorObject({
          ...errorObject,
          getTransactionApiErr: jsonData?.msg || "error",
        });
      }
    } catch (error) {
      setErrorObject({ ...errorObject, getTransactionApiErr: error.message });
    } finally {
      setIsLoadingObject({ ...loadingObject, getTransactionApiLoading: false });
    }
  };

  useEffect(() => {
    getTransactions();
  }, []);

  const updateInput = (event) => {
    setData({ ...data, [event.target.name]: event.target.value });
  };

  const onChangeOptionId = (event) => {
    setOptionId(event.target.value);
  };

  const onAddTransaction = async (event) => {
    event.preventDefault();
    try {
      setIsLoadingObject({
        ...loadingObject,
        insertTransactionApiLoading: true,
      });
      const myData = {
        title: data.titleInput,
        amount: data.amountInput,
        category: optionId,
      };
      const token = Cookies.get("auth_token");
      let response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(myData),
      });
      const jsonData = await response.json();
      if (response.ok) {
        getTransactions();
      } else {
        setErrorObject({
          ...errorObject,
          insertTransactionApiErr: jsonData.msg,
        });
      }
    } catch (error) {
      setErrorObject({
        ...errorObject,
        insertTransactionApiErr: error.message,
      });
    } finally {
      setIsLoadingObject({
        ...loadingObject,
        insertTransactionApiLoading: false,
      });
      setData(initialData);
    }
  };

  return (
    <>
      <BalanceDetailsContainer
        transactionsList={transactionsList}
        isLoading={loadingObject.getTransactionApiLoading}
      />
      <div>
        <div className={styles.transactionDetails}>
          <form className={styles.transactionForm} onSubmit={onAddTransaction}>
            <h1 className={styles.transactionHeader}>Add Transaction</h1>
            <label className={styles.inputLabel} htmlFor="title">
              TITLE
            </label>
            <input
              type="text"
              id="title"
              value={data.titleInput}
              name="titleInput"
              onChange={updateInput}
              className={styles.input}
              placeholder="TITLE"
            />
            <label className={styles.inputLabel} htmlFor="amount">
              AMOUNT
            </label>
            <input
              type="text"
              id="amount"
              className={styles.input}
              value={data.amountInput}
              name="amountInput"
              onChange={updateInput}
              placeholder="AMOUNT"
            />
            <label className={styles.inputLabel} htmlFor="select">
              TYPE
            </label>
            <select
              id="select"
              className={styles.input}
              value={optionId}
              onChange={onChangeOptionId}>
              {transactionTypeOptions.map((eachOption) => (
                <option key={eachOption.optionId} value={eachOption.optionId}>
                  {eachOption.displayText}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className={styles.button}
              disabled={loadingObject.insertTransactionApiLoading}>
              {loadingObject.insertTransactionApiLoading ? (
                <TailSpin width={20} height={20} color="red" />
              ) : (
                "Add"
              )}
            </button>
          </form>
          <div className={styles.historyTransactions}>
            <div className={styles.transactionHeaderContainer}>
              <h1 className={styles.transactionHeader}>History</h1>
              {<PopupButton transactionsList={transactionsList} />}
            </div>

            <div className={styles.transactionsTableContainer}>
              <ul className={styles.transactionsTable}>
                <li className={styles.tableHeader}>
                  <p className={styles.tableHeaderCell}>Title</p>
                  <p className={styles.tableHeaderCell}>Amount</p>
                  <p className={styles.tableHeaderCell}>Type</p>
                  <p className={styles.tableHeaderCell}>Date</p>
                </li>
                {transactionsList.map((eachTransaction) => (
                  <TransactionItem
                    key={eachTransaction.id}
                    transactionDetails={eachTransaction}
                    getTransactions={getTransactions}
                  />
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TransactionDetails;

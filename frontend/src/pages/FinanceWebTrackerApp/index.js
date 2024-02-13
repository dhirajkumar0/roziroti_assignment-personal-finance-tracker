import GreetingCard from "../../components/GreetingCard";
import styles from "./index.module.css";

import TransactionDetails from "../../components/TransactionDetails";

function FinanceWebTrackerApp() {
  return (
    <div className={styles.appContainer}>
      <div className={styles.responsiveContainer}>
        <GreetingCard />
        <TransactionDetails />
      </div>
    </div>
  );
}

export default FinanceWebTrackerApp;

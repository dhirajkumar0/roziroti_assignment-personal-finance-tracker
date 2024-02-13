import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import FinanceWebTrackerApp from "./pages/FinanceWebTrackerApp";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/login" element={<LoginPage />} />
        <Route exact path="/register" element={<RegisterPage />} />
        <Route
          exact
          path="/"
          element={<ProtectedRoute component={FinanceWebTrackerApp} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

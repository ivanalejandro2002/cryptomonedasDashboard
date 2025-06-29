import React from "react";
import { Routes, Route } from "react-router-dom";
import StockDashboard from "./pages/StockDashboard";
import CryptoDetail from "./pages/CryptoDetail";
import CompareChart from "./pages/CompareChart";
import RegressionChart from "./pages/RegressionChart";

function App() {
  return (
    <Routes>
      <Route path="/" element={<StockDashboard />} />
      <Route path="/crypto/:cryptoName" element={<CryptoDetail />} />
      <Route path="/compare" element={<CompareChart />} />
      <Route path="/regression/:crypto" element={<RegressionChart />} />
    </Routes>
  );
}

export default App;
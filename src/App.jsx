import React from "react";
import { Routes, Route } from "react-router-dom";
import StockDashboard from "./pages/StockDashboard";
import CryptoDetail from "./pages/CryptoDetail";

function App() {
  return (
    <Routes>
      <Route path="/" element={<StockDashboard />} />
      <Route path="/crypto/:cryptoName" element={<CryptoDetail />} />
    </Routes>
  );
}

export default App;
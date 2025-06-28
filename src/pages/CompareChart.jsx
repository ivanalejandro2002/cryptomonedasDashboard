import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Button } from "../components/ui/button";
import { useParams, useNavigate } from "react-router-dom";

import "/src/css/styles.css";
import styles from "/src/css/button.module.css";

const cryptoList = [
  { name: "Bitcoin", image: "/src/assets/images/bitcoin.png" },
  { name: "Ethereum", image: "/src/assets/images/ethereum.svg" },
  { name: "XRP", image: "/src/assets/images/xrp.png" },
  { name: "Solana", image: "/src/assets/images/solana.png" },
  { name: "TRON", image: "/src/assets/images/tron.png" },
  { name: "Dogecoin", image: "/src/assets/images/dogecoin.png" },
  { name: "Cardano", image: "/src/assets/images/cardano.png" },
  { name: "Hyperliquid", image: "/src/assets/images/hyperliquid.png" },
  { name: "BitcoinCash", image: "/src/assets/images/bitcoincash.png" },
  { name: "Chainlink", image: "/src/assets/images/chainlink.png" }
];

const cryptoColors = {
  Bitcoin: "#F7931A",
  Ethereum: "#3C3C3D",
  XRP: "#00FFA3",
  Solana: "#0033AD",
  Tron: "#00AAE4",
  Dogecoin: "#E6007A",
  Cardano: "#A6A9AA",
  Hyperliquid: "#C2A633",
  BitcoinCash: "#2A5ADA",
  Chainlink: "#E84142"
};

export default function CompareChart() {
  const navigate = useNavigate();
  const [selectedCryptos, setSelectedCryptos] = useState([]);
  const [selectedRange, setSelectedRange] = useState(12);
  const [chartData, setChartData] = useState({});
  const [mergedData, setMergedData] = useState([]);

  useEffect(() => {
    const mockData = {};
    cryptoList.forEach(({ name }) => {
      mockData[name] = Array.from({ length: selectedRange }, (_, i) => {
        const value = Math.random() * 100;
        return { time: `${i}:00`, value };
      });
    });
    setChartData(mockData);
  }, [selectedRange]);

  useEffect(() => {
    if (selectedCryptos.length === 0) {
      setMergedData([]);
      return;
    }

    //Acá se hace la insersión de datos, por ahora se agarran unos randoms.
    const length = selectedRange;
    const result = Array.from({ length }, (_, i) => {
      const time = `${i}:00`;
      const point = { time };
      selectedCryptos.forEach((crypto) => {
        point[crypto] = chartData[crypto]?.[i]?.value || null;
      });
      return point;
    });
    setMergedData(result);
  }, [chartData, selectedCryptos, selectedRange]);

  const toggleCrypto = (crypto) => {
    setSelectedCryptos((prev) =>
      prev.includes(crypto)
        ? prev.filter((c) => c !== crypto)
        : [...prev, crypto]
    );
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Comparar criptomonedas</h1>

      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Comparar criptomonedas</h1>
        <Button className="button" onClick={() => navigate("/")}>Volver</Button>
      </div>
      <div className="w-full mb-8">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={mergedData}>
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            {selectedCryptos.map((crypto) => (
              <Line
                key={crypto}
                type="monotone"
                dataKey={crypto}
                name={crypto}
                stroke={cryptoColors[crypto]}
                strokeWidth={2}
                dot={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        {cryptoList.map(({ name, image }) => (
          <label key={name} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedCryptos.includes(name)}
              onChange={() => toggleCrypto(name)}
            />
            <img src={image} alt={name} className="w-5 h-5 rounded-full photo" />
            <span style={{ color: cryptoColors[name] }}>{name}</span>
          </label>
        ))}
      </div>

      <div className="mb-4">
        <label className="font-semibold mr-2">Rango de tiempo (horas):</label>
        <select
          value={selectedRange}
          onChange={(e) => setSelectedRange(Number(e.target.value))}
          className="border px-2 py-1 rounded"
        >
          {Array.from({ length: 24 }, (_, i) => i + 1).map((h) => (
            <option key={h} value={h}>{h}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
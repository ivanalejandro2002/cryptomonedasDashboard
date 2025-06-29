import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

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
  { name: "Bitcoin Cash", image: "/src/assets/images/bitcoincash.png" },
  { name: "Chainlink", image: "/src/assets/images/chainlink.png" }
];

//Genera los tiempos de 15 en 15 minutos en reversa hasta cumplir la cuota
function generateTimeLabels(hours, samplesPerHour = 4) {
  const now = new Date();
  const intervalMs = 3600000 / samplesPerHour;
  const totalSamples = hours * samplesPerHour;

  return Array.from({ length: totalSamples }, (_, i) => {
    const date = new Date(now.getTime() - (totalSamples - 1 - i) * intervalMs);
    return `${date.getDate().toString().padStart(2, "0")}/${
      (date.getMonth() + 1).toString().padStart(2, "0")
    } ${date.getHours().toString().padStart(2, "0")}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  });
}

export default function StockDashboard() {
  const [selectedRange, setSelectedRange] = useState(1);
  const [expandedCharts, setExpandedCharts] = useState({});
  const [chartData, setChartData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    //Etiquetas generadas de forma aleatoria de cada hora de dato
    const labels = generateTimeLabels(selectedRange);
    const mockData = {};

    cryptoList.forEach((crypto) => {
      mockData[crypto.name] = labels.map((label) => ({
        time: label,
        value: Math.random() * 100
      }));
    });

    setChartData(mockData);
  }, [selectedRange]);

  const toggleChart = (crypto) => {
    setExpandedCharts((prev) => ({ ...prev, [crypto]: !prev[crypto] }));
  };

  const goToDetail = (crypto) => {
    navigate(`/crypto/${crypto}`);
  };

  const goToStats = (crypto) => {
    navigate(`/regression/${crypto}`);
  };

  const goToCompare = () => {
    navigate("/compare");
  };

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="title-span">
        <label className="titular">Crypto Dashboard</label>
      </div>
      <div className="mt-2 flex justify-end">
        <Button className="button" onClick={goToCompare}>
          Comparar Cryptos
        </Button>
      </div>

      <div className="col-span-full flex items-center gap-2 mb-4">
        <label className="font-bold">Rango de tiempo (horas):</label>
        <select
          value={selectedRange}
          onChange={(e) => setSelectedRange(Number(e.target.value))}
          className="border rounded px-2 py-1"
        >
          {Array.from({ length: 24 }, (_, i) => i + 1).map((hr) => (
            <option key={hr} value={hr}>
              {hr}
            </option>
          ))}
        </select>
      </div>

      {cryptoList.map((crypto, idx) => {
        const data = chartData[crypto.name] || [];
        const isRising =
          data.length >= 2 && data[data.length - 1].value > data[0].value;

        return (
          <Card key={idx} className="rounded-2xl shadow p-2">
            <CardContent>
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleChart(crypto.name)}
              >
                <div className="flex items-center gap-2">
                  <img
                    src={crypto.image}
                    alt={crypto.name}
                    className="w-6 h-6 rounded-full object-cover photo"
                  />
                  <h2 className="text-xl font-semibold">{crypto.name}</h2>
                </div>
                {expandedCharts[crypto.name] ? <ChevronUp /> : <ChevronDown />}
              </div>

              {expandedCharts[crypto.name] && (
                <>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={data}>
                      <XAxis
                        dataKey="time"
                        interval={Math.floor((data.length - 1) / 6)}
                        angle={-45}
                        height={50}
                      />
                      <YAxis hide />
                      <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke={isRising ? "#22c55e" : "#ef4444"}
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                  <div className="mt-2 flex justify-end gap-2">
                    <Button className="button" onClick={() => goToDetail(crypto.name)}>
                      Ver más
                    </Button>
                    <Button className="button" onClick={() => goToStats(crypto.name)}>
                      Estadísticas
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

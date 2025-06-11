import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

const cryptoList = [
  { name: "Bitcoin", image: "/images/bitcoin.png" },
  { name: "Ethereum", image: "/images/ethereum.png" },
  { name: "Solana", image: "/images/solana.png" },
  { name: "Cardano", image: "/images/cardano.png" },
  { name: "Ripple", image: "/images/ripple.png" },
  { name: "Polkadot", image: "/images/polkadot.png" },
  { name: "Litecoin", image: "/images/litecoin.png" },
  { name: "Dogecoin", image: "/images/dogecoin.png" },
  { name: "Chainlink", image: "/images/chainlink.png" },
  { name: "Avalanche", image: "/images/avalanche.png" }
];

export default function StockDashboard() {
  const [selectedRange, setSelectedRange] = useState(1);
  const [expandedCharts, setExpandedCharts] = useState({});
  const [chartData, setChartData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const mockData = {};
    cryptoList.forEach((crypto) => {
      mockData[crypto.name] = Array.from({ length: selectedRange * 4 }, (_, i) => {
        const value = Math.random() * 100;
        return { time: `${i}:00`, value };
      });
    });
    setChartData(mockData);
  }, [selectedRange]);

  const toggleChart = (crypto) => {
    setExpandedCharts((prev) => ({ ...prev, [crypto]: !prev[crypto] }));
  };

  const goToDetail = (crypto) => {
    navigate(`/crypto/${crypto}`);
  };

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="col-span-full flex items-center gap-2 mb-4">
        <label className="font-bold">Rango de tiempo (horas):</label>
        <select
          value={selectedRange}
          onChange={(e) => setSelectedRange(Number(e.target.value))}
          className="border rounded px-2 py-1"
        >
          {Array.from({ length: 24 }, (_, i) => i + 1).map((hr) => (
            <option key={hr} value={hr}>{hr}</option>
          ))}
        </select>
      </div>

      {cryptoList.map((crypto, idx) => {
        const data = chartData[crypto.name] || [];
        const isRising = data.length >= 2 && data[data.length - 1].value > data[0].value;
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
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <h2 className="text-xl font-semibold">{crypto.name}</h2>
                </div>
                {expandedCharts[crypto.name] ? <ChevronUp /> : <ChevronDown />}
              </div>
              {expandedCharts[crypto.name] && (
                <>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={data}>
                      <XAxis dataKey="time" hide />
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
                  <div className="mt-2 flex justify-end">
                    <Button onClick={() => goToDetail(crypto.name)}>Ver más</Button>
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
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Button } from "../components/ui/button";

import styles from "/src/css/button.module.css";

export default function CryptoDetail() {
  const { cryptoName } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState([]);

  useEffect(() => {
    // Aquí se debe hacer la consulta a la base de datos para obtener los datos de la criptomoneda
    // Por ahora se simulan datos
    const simulatedData = Array.from({ length: 24 }, (_, i) => {
      const value = Math.random() * 100;
      return { time: `${i}:00`, value };
    });
    setData(simulatedData);
  }, [cryptoName]);

  const isRising = data.length >= 2 && data[data.length - 1].value > data[0].value;

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Detalle de {cryptoName}</h1>
        <Button className="button" onClick={() => navigate("/")}>Volver</Button>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <XAxis dataKey="time" />
          <YAxis />
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
    </div>
  );
}

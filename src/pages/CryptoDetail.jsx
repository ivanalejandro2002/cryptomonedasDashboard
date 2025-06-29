import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Button } from "../components/ui/button";
import styles from "/src/css/button.module.css";

//Genera los tiempos de 15 en 15 minutos en reversa hasta cumplir la cuota
function generateTimeLabels(hours) {
  const now = new Date();
  return Array.from({ length: hours }, (_, i) => {
    const date = new Date(now.getTime() - (hours - 1 - i) * 3600000);
    return `${date.getMonth().toString().padStart(2, "0")}/${
      (date.getDate() + 1).toString().padStart(2, "0")
    } ${date.getHours().toString().padStart(2, "0")}:00`;
  });
}

export default function CryptoDetail() {
  const { cryptoName } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState([]);

  useEffect(() => {
    // Aquí se debe hacer la consulta a la base de datos para obtener los datos de la criptomoneda
    // Por ahora se simulan datos con 1 muestra por hora en las últimas 24 horas
    
    //Etiquetas generadas de forma aleatoria de cada hora de dato
    const labels = generateTimeLabels(24);
    const simulatedData = labels.map((label) => ({
      time: label,
      value: Math.random() * 100,
    }));
    setData(simulatedData);
  }, [cryptoName]);

  const isRising = data.length >= 2 && data[data.length - 1].value > data[0].value;

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Detalle de {cryptoName}</h1>
        <Button className={styles.button} onClick={() => navigate("/")}>Volver</Button>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" interval={2} angle={-45} height={60} />
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

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  XYPlot,
  XAxis,
  YAxis,
  HorizontalGridLines,
  LineSeries,
  MarkSeries,
  DiscreteColorLegend,
  Hint,
} from "react-vis";

const cryptoColors = {
  Bitcoin: "#F7931A",
  Ethereum: "#3C3C3D",
  Solana: "#00FFA3",
  Cardano: "#0033AD",
  Ripple: "#00AAE4",
  Polkadot: "#E6007A",
  Litecoin: "#A6A9AA",
  Dogecoin: "#C2A633",
  Chainlink: "#2A5ADA",
  Avalanche: "#E84142",
};

function getComplementaryColor(hex) {
  const r = 255 - parseInt(hex.slice(1, 3), 16);
  const g = 255 - parseInt(hex.slice(3, 5), 16);
  const b = 255 - parseInt(hex.slice(5, 7), 16);
  return `rgb(${r}, ${g}, ${b})`;
}

function linearRegression(data) {
  const n = data.length;
  if (n === 0) return { a: 0, b: 0 };

  let sumX = 0,
    sumY = 0,
    sumXY = 0,
    sumXX = 0;

  for (let i = 0; i < n; i++) {
    const x = i;
    const y = data[i].value;
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumXX += x * x;
  }

  const b = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const a = (sumY - b * sumX) / n;

  return { a, b };
}

function createRegressionLine(data, a, b) {
  return data.map((_, i) => ({
    x: i,
    y: a + b * i,
  }));
}

function convertToXY(data) {
  return data.map((point, i) => ({
    x: i,
    y: point.value,
  }));
}

//Genera los tiempos de 15 en 15 minutos en reversa hasta cumplir la cuota
function generateTimeLabels(hours, samplesPerHour = 4) {
  const now = new Date();
  const intervalMs = 3600000 / samplesPerHour;
  const totalSamples = hours * samplesPerHour;

  return Array.from({ length: totalSamples }, (_, i) => {
    const date = new Date(now.getTime() - (totalSamples - 1 - i) * intervalMs);
    return `${date.getMonth().toString().padStart(2, "0")}/${
      (date.getDate() + 1).toString().padStart(2, "0")
    } ${date.getHours().toString().padStart(2, "0")}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  });
}

export default function RegressionChart() {
  const navigate = useNavigate();
  const { crypto } = useParams();
  const [range, setRange] = useState(12);
  const [data, setData] = useState([]);
  const [regressionData, setRegressionData] = useState([]);
  const [hoveredPoint, setHoveredPoint] = useState(null);

  //Etiquetas generadas de forma aleatoria de cada hora de dato
  const labels = generateTimeLabels(range);

  useEffect(() => {
    // Simulación de datos
    const simulatedData = Array.from({ length: range*4 }, () => ({
      value: Math.random() * 100,
    }));
    setData(simulatedData);

    const { a, b } = linearRegression(simulatedData);
    const regLine = createRegressionLine(simulatedData, a, b);
    setRegressionData(regLine);
  }, [crypto, range]);

  const baseColor = cryptoColors[crypto] || "#8884d8";
  const complementaryColor = getComplementaryColor(baseColor);

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center">{crypto} - Datos y Regresión</h2>

      <div className="flex items-center justify-between mb-4">
        <Button className="button" onClick={() => navigate("/")}>Volver</Button>
      </div>

      <div className="mb-6 flex justify-center items-center gap-6">
        <label className="font-semibold">Rango de tiempo (horas):</label>
        <select
          value={range}
          onChange={(e) => setRange(Number(e.target.value))}
          className="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          {Array.from({ length: 24 }, (_, i) => i + 1).map((h) => (
            <option key={h} value={h}>
              {h}
            </option>
          ))}
        </select>
      </div>

      <XYPlot
        height={450}
        width={850}
        margin={{ left: 70, right: 40, top: 20, bottom: 60 }}
        onMouseLeave={() => setHoveredPoint(null)}
      >
        <HorizontalGridLines style={{ stroke: "#e0e0e0" }} />
        <XAxis
          title="Tiempo (horas)"

          //labels[v] tendrá los timestamps de los datos
          //hay otro más abajo
          tickFormat={(v) => labels[v]}
          style={{
            text: { fill: "#555", fontWeight: 600, fontSize: 14 },
            title: { fontWeight: 700, fontSize: 16 },
          }}
          tickLabelAngle={-45}
          tickTotal={range > 12 ? 12 : range}
        />
        <YAxis
          title="Valor"
          style={{
            text: { fill: "#555", fontWeight: 600, fontSize: 14 },
            title: { fontWeight: 700, fontSize: 16 },
          }}
        />

        <LineSeries
          animation="gentle"
          data={regressionData}
          color={complementaryColor}
          curve="curveMonotoneX"
          style={{ strokeWidth: 3 }}
          onNearestX={(datapoint) => setHoveredPoint({ ...datapoint, type: "regression" })}
        />

        <MarkSeries
          animation="gentle"
          data={convertToXY(data)}
          color={baseColor}
          size={7}
          stroke="#333"
          strokeWidth={1.5}
          onValueMouseOver={(datapoint) => setHoveredPoint({ ...datapoint, type: "original" })}
          onValueMouseOut={() => setHoveredPoint(null)}
        />

        {hoveredPoint && (
          <Hint
            value={hoveredPoint}
            style={{
              background: "rgba(0,0,0,0.75)",
              color: "white",
              padding: "6px 10px",
              borderRadius: "4px",
              fontWeight: "bold",
            }}
          >
            <div>
              <div>
                <strong>{hoveredPoint.type === "original" ? "Dato original" : "Regresión"}</strong>
              </div>
              <div>Hora: {labels[hoveredPoint.x]}</div>
              <div>Valor: {hoveredPoint.y.toFixed(2)}</div>
            </div>
          </Hint>
        )}

        <DiscreteColorLegend
          orientation="horizontal"
          items={[
            { title: "Datos originales", color: baseColor },
            { title: "Regresión lineal", color: complementaryColor },
          ]}
          style={{ position: "absolute", bottom: 10, left: 50 }}
        />
      </XYPlot>
    </div>
  );
}

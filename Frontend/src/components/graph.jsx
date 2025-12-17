import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function WeatherChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchWeather = async () => {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=Kolkata&appid=5d0e7c16b9f4d577e463c5436404c021&units=metric`
      );
      const json = await res.json();

      // format data for graph
      const chartData = json.list.map((item) => ({
        time: item.dt_txt.slice(5, 16), // "MM-DD HH:mm"
        temp: item.main.temp,
      }));

      setData(chartData);
    };

    fetchWeather();
  }, []);

  return (
    <div className="p-6 rounded-2xl shadow-lg bg-transparent backdrop-blur-md flex flex-col items-center">
      <h2 className="text-xl font-bold mb-4 text-center text-white">
        Temperature Forecast
      </h2>
      
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#999" />

          {/* X Axis - Red */}
          <XAxis
            dataKey="time"
            tick={{ fill: "red", fontSize: 12 }}
            axisLine={{ stroke: "red" }}
            tickLine={{ stroke: "red" }}
          />

          {/* Y Axis - Red */}
          <YAxis
            tick={{ fill: "red", fontSize: 12 }}
            axisLine={{ stroke: "red" }}
            tickLine={{ stroke: "red" }}
          />

          <Tooltip />

          {/* Line - Green */}
          <Line
            type="monotone"
            dataKey="temp"
            stroke="green"
            strokeWidth={3}
            dot={{ r: 4, stroke: "green", fill: "green" }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

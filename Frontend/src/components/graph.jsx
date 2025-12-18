import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function AirQualityCard({
  city = "Delhi",
  temperature = 32,
  weather = "Haze",
  aqi = 225,
  label = "Poor",
  forecastData = [],
}) {
  const descriptionMap = {
    Good: "Air quality is satisfactory, and air pollution poses little or no risk.",
    Satisfactory:
      "Air quality is acceptable; some pollutants may cause concern for sensitive people.",
    Moderate:
      "Breathing discomfort to people with lung disease such as asthma.",
    Poor: "May cause breathing discomfort for people with prolonged exposure.",
    "Very Poor": "Respiratory illness on prolonged exposure.",
    Severe: "May cause respiratory effects even on healthy people.",
  };

  const colorMap = {
    Good: "text-green-400",
    Satisfactory: "text-lime-400",
    Moderate: "text-yellow-400",
    Poor: "text-orange-400",
    "Very Poor": "text-red-400",
    Severe: "text-red-600",
  };

  // AQI circle math
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(aqi / 500, 1);
  const offset = circumference * (1 - progress);

  return (
    <div className="w-full max-w-md rounded-3xl bg-[#020617]/90 text-white p-5 backdrop-blur-lg">
      {/* CITY INFO */}
      <div className="text-center">
        <h2 className="text-xl font-semibold">{city}</h2>
        <h1 className="text-5xl font-bold mt-2">{temperature}°</h1>
        <p className="text-sm mt-1 text-gray-300">
          {weather} · AQI {aqi}
        </p>
        <p className={`font-semibold ${colorMap[label]}`}>{label}</p>
      </div>

      {/* AQI CARD */}
      <div className="mt-5 flex items-center justify-between rounded-2xl bg-black/60 px-4 py-3">
        <div>
          <h3 className={`text-lg font-semibold ${colorMap[label]}`}>
            {label}
          </h3>
          <p className="text-xs text-gray-300 max-w-[180px]">
            {descriptionMap[label]}
          </p>
        </div>

        {/* AQI CIRCLE */}
        <div className="relative h-24 w-24">
          <svg className="h-full w-full rotate-[-90deg]">
            <circle
              cx="48"
              cy="48"
              r={radius}
              stroke="#1f2937"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="48"
              cy="48"
              r={radius}
              stroke="#f97316"
              strokeWidth="8"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-semibold">{aqi}</span>
          </div>
        </div>
      </div>

      {/* TEMPERATURE FORECAST */}
      <div className="mt-5 h-[180px] rounded-2xl bg-black/50 p-3">
        <h3 className="text-sm font-semibold text-center mb-2">
          Temperature Forecast
        </h3>

        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={forecastData}>
            <CartesianGrid stroke="#ffffff20" strokeDasharray="3 3" />
            <XAxis dataKey="time" tick={{ fill: "#e5e7eb", fontSize: 11 }} />
            <YAxis tick={{ fill: "#e5e7eb", fontSize: 11 }} />
            <Line
              type="monotone"
              dataKey="temp"
              stroke="#38bdf8"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

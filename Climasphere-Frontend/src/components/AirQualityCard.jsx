import React from "react";

export default function AirQualityCard({ aqi = 225, label = "Poor" }) {
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

  // Circle math
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(aqi / 500, 1);
  const offset = circumference * (1 - progress);

  return (
    <div className="w-[23.5rem] h-[7rem] rounded-2xl bg-[#111827]/80 text-white backdrop-blur-md">
      <div className="flex items-center justify-between">
        {/* LEFT */}
        <div className="flex flex-col w-[10rem] ml-[1.5rem]">
          <span className={`text-lg font-semibold ${colorMap[label]}`}>
            {label}
          </span>{" "}
          <p className="text-sm text-gray-300">{descriptionMap[label]}</p>
        </div>
        {/* RIGHT – AQI CIRCLE */}
        <div className="relative h-28 w-28">
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
              stroke="url(#aqiGradient)"
              strokeWidth="8"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
            />
            <defs>
              <linearGradient
                id="aqiGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%">
                <stop offset="0%" stopColor="#22c55e" />
                <stop offset="50%" stopColor="#facc15" />
                <stop offset="100%" stopColor="#f97316" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex left-[1.8rem] top-[2.8rem]">
            <span className="text-[1.5rem] font-semibold">{aqi}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

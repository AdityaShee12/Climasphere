// WeatherBackground.jsx
import { useEffect, useState } from "react";

const SunnyDay = () => (
  <div className="absolute inset-0 overflow-hidden">
    {/* Sky gradient */}
    <div className="absolute inset-0 bg-gradient-to-b from-sky-400 via-sky-300 to-sky-200" />

    {/* Sun */}
    <div className="absolute top-12 left-1/2 -translate-x-1/2">
      <div className="relative w-20 h-20">
        {/* Glow rings */}
        <div className="absolute inset-0 rounded-full bg-yellow-300/30 animate-ping" style={{ animationDuration: "3s" }} />
        <div className="absolute inset-2 rounded-full bg-yellow-300/20 animate-ping" style={{ animationDuration: "2.5s", animationDelay: "0.5s" }} />
        {/* Sun core */}
        <div className="absolute inset-3 rounded-full bg-yellow-300 shadow-[0_0_60px_20px_rgba(253,224,71,0.5)]" />
        {/* Rays */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-5 bg-yellow-300/70 rounded-full left-1/2 -translate-x-1/2 origin-bottom"
            style={{
              bottom: "50%",
              transform: `translateX(-50%) rotate(${i * 45}deg) translateY(-200%)`,
              animation: "spin 8s linear infinite",
            }}
          />
        ))}
      </div>
    </div>

    {/* Clouds */}
    {[
      { top: "15%", left: "-10%", scale: 1, duration: "18s", delay: "0s" },
      { top: "25%", left: "-20%", scale: 0.7, duration: "25s", delay: "5s" },
      { top: "10%", left: "-15%", scale: 0.5, duration: "30s", delay: "10s" },
    ].map((c, i) => (
      <div
        key={i}
        className="absolute"
        style={{
          top: c.top,
          left: c.left,
          transform: `scale(${c.scale})`,
          animation: `moveCloud ${c.duration} linear ${c.delay} infinite`,
        }}
      >
        <Cloud color="white" opacity="0.9" />
      </div>
    ))}

    <style>{`
      @keyframes moveCloud {
        from { transform: translateX(0) scale(${1}); }
        to   { transform: translateX(120vw) scale(${1}); }
      }
      @keyframes spin {
        from { transform: translateX(-50%) rotate(0deg) translateY(-200%); }
        to   { transform: translateX(-50%) rotate(360deg) translateY(-200%); }
      }
    `}</style>
  </div>
);

const NightSky = () => (
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-b from-[#020817] via-[#0a0f2e] to-[#0d1117]" />

    {/* Stars */}
    {[...Array(80)].map((_, i) => (
      <div
        key={i}
        className="absolute rounded-full bg-white"
        style={{
          width: `${Math.random() * 2.5 + 0.5}px`,
          height: `${Math.random() * 2.5 + 0.5}px`,
          top: `${Math.random() * 75}%`,
          left: `${Math.random() * 100}%`,
          opacity: Math.random() * 0.7 + 0.3,
          animation: `twinkle ${Math.random() * 3 + 2}s ease-in-out ${Math.random() * 2}s infinite`,
        }}
      />
    ))}

    {/* Moon */}
    <div className="absolute top-14 right-16">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full bg-yellow-100 shadow-[0_0_40px_15px_rgba(254,240,138,0.3)]" />
        <div className="absolute top-1 right-1 w-12 h-12 rounded-full bg-[#0a0f2e]" />
      </div>
    </div>

    {/* Moving clouds (dark) */}
    {[
      { top: "20%", duration: "30s", delay: "0s", opacity: 0.3 },
      { top: "40%", duration: "45s", delay: "8s", opacity: 0.2 },
    ].map((c, i) => (
      <div
        key={i}
        className="absolute"
        style={{
          top: c.top,
          left: "-20%",
          opacity: c.opacity,
          animation: `moveCloudNight ${c.duration} linear ${c.delay} infinite`,
        }}
      >
        <Cloud color="#1e3a5f" opacity="1" />
      </div>
    ))}

    <style>{`
      @keyframes twinkle {
        0%, 100% { opacity: 0.2; transform: scale(0.8); }
        50%       { opacity: 1;   transform: scale(1.2); }
      }
      @keyframes moveCloudNight {
        from { transform: translateX(0); }
        to   { transform: translateX(140vw); }
      }
    `}</style>
  </div>
);

const RainScene = () => (
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-b from-slate-700 via-slate-600 to-slate-500" />

    {/* Dark clouds */}
    {[
      { top: "-5%", left: "-10%", scale: 1.3 },
      { top: "0%",  left: "30%",  scale: 1.1 },
      { top: "-8%", left: "65%",  scale: 1.4 },
    ].map((c, i) => (
      <div key={i} className="absolute" style={{ top: c.top, left: c.left, transform: `scale(${c.scale})` }}>
        <Cloud color="#374151" opacity="1" />
      </div>
    ))}

    {/* Rain drops */}
    {[...Array(60)].map((_, i) => (
      <div
        key={i}
        className="absolute bg-sky-300/40 rounded-full"
        style={{
          width: "1.5px",
          height: `${Math.random() * 15 + 10}px`,
          left: `${Math.random() * 100}%`,
          top: `-${Math.random() * 20}%`,
          animation: `fall ${Math.random() * 0.6 + 0.5}s linear ${Math.random() * 1.5}s infinite`,
          transform: "rotate(15deg)",
        }}
      />
    ))}

    {/* Puddle ripples at bottom */}
    {[...Array(5)].map((_, i) => (
      <div
        key={i}
        className="absolute bottom-4 rounded-full border border-sky-300/20"
        style={{
          width: "20px",
          height: "8px",
          left: `${15 + i * 18}%`,
          animation: `ripple 1.5s ease-out ${i * 0.3}s infinite`,
        }}
      />
    ))}

    <style>{`
      @keyframes fall {
        from { transform: translateY(0) rotate(15deg); opacity: 1; }
        to   { transform: translateY(110vh) rotate(15deg); opacity: 0.4; }
      }
      @keyframes ripple {
        0%   { transform: scale(1); opacity: 0.5; }
        100% { transform: scale(4); opacity: 0; }
      }
    `}</style>
  </div>
);

const CloudyScene = () => (
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-b from-slate-500 via-slate-400 to-slate-300" />

    {[
      { top: "5%",  left: "-15%", scale: 1.4, duration: "20s", delay: "0s"  },
      { top: "20%", left: "-20%", scale: 1.0, duration: "28s", delay: "4s"  },
      { top: "0%",  left: "-10%", scale: 1.6, duration: "35s", delay: "8s"  },
      { top: "30%", left: "-25%", scale: 0.8, duration: "22s", delay: "12s" },
      { top: "12%", left: "-30%", scale: 1.2, duration: "40s", delay: "2s"  },
    ].map((c, i) => (
      <div
        key={i}
        className="absolute"
        style={{
          top: c.top,
          left: c.left,
          transform: `scale(${c.scale})`,
          animation: `moveCloudCloudy ${c.duration} linear ${c.delay} infinite`,
        }}
      >
        <Cloud color="#94a3b8" opacity="0.85" />
      </div>
    ))}

    <style>{`
      @keyframes moveCloudCloudy {
        from { transform: translateX(0); }
        to   { transform: translateX(130vw); }
      }
    `}</style>
  </div>
);

const Cloud = ({ color, opacity }) => (
  <svg width="180" height="80" viewBox="0 0 180 80" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="90" cy="60" rx="80" ry="25" fill={color} fillOpacity={opacity} />
    <ellipse cx="60" cy="50" rx="40" ry="30" fill={color} fillOpacity={opacity} />
    <ellipse cx="110" cy="45" rx="45" ry="35" fill={color} fillOpacity={opacity} />
    <ellipse cx="80" cy="40" rx="35" ry="28" fill={color} fillOpacity={opacity} />
  </svg>
);

const getWeatherType = (condition, isNight) => {
  if (!condition) return isNight ? "night" : "sunny";
  const c = condition.toLowerCase();
  if (c.includes("rain") || c.includes("drizzle") || c.includes("shower")) return "rain";
  if (c.includes("cloud") || c.includes("overcast") || c.includes("mist") || c.includes("fog")) return "cloudy";
  if (isNight) return "night";
  return "sunny";
};

const WeatherBackground = ({ weatherCondition, hour }) => {
  const isNight = hour !== undefined ? (hour < 6 || hour >= 19) : false;
  const type = getWeatherType(weatherCondition, isNight);

  return (
    <div className="absolute inset-0 -z-10">
      {type === "sunny"  && <SunnyDay />}
      {type === "night"  && <NightSky />}
      {type === "rain"   && <RainScene />}
      {type === "cloudy" && <CloudyScene />}
    </div>
  );
};

export default WeatherBackground;
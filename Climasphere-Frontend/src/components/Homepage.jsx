import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { BACKEND_API } from "../Backend_API.js";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { MdSettings, MdAdd } from "react-icons/md";
import AirQualityCard from "./AirQualityCard.jsx";
import { AiOutlineSearch } from "react-icons/ai";
import { clearUser } from "../features/userSlice.js";
import ButtomNavbar from "./buttomNavbar.jsx";
import { Outlet } from "react-router-dom";

const Homepage = () => {
  const [city, setCity] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const DEFAULT_CITY = "Delhi";
  const { userName, fullName, avatar, userproffesion } = useSelector(
    (state) => state.user
  );
  const navigate = useNavigate();
  let pm_25;
  let visibility;
  let main;
  let windSpeed;
  let clouds;
  const [weatherConditions, setweatherConditions] = useState("");
  const [AQI, setAQI] = useState(0);
  const [AQIlabel, setAQIlabel] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");
  let components = {};
  const [active, setActive] = useState("Home");
  const [contextMenu, setContextMenu] = useState({
    show: false,
    x: 0,
    y: 0,
  });
  const [originalY, setOriginalY] = useState(null);
  const contextRef = useRef(null);
  const [menuAnimation, setMenuAnimation] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [dilogueBox, setDilogueBox] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [dataAnalyst, setDataAnalyst] = useState(false);
  // function calculateSubAQI(concentration, breakpoints) {
  //   const bp = breakpoints.find(
  //     (b) => concentration >= b.cLow && concentration <= b.cHigh
  //   );

  //   if (!bp) return { aqi: 500, label: "Severe" };

  //   const aqi =
  //     ((bp.iHigh - bp.iLow) / (bp.cHigh - bp.cLow)) *
  //       (concentration - bp.cLow) +
  //     bp.iLow;

  //   return {
  //     aqi: Math.round(aqi),
  //     label: bp.label,
  //   };
  // }

  // const PM25_BREAKPOINTS = [
  //   { cLow: 0, cHigh: 30, iLow: 0, iHigh: 50, label: "Good" },
  //   { cLow: 31, cHigh: 60, iLow: 51, iHigh: 100, label: "Satisfactory" },
  //   { cLow: 61, cHigh: 90, iLow: 101, iHigh: 200, label: "Moderate" },
  //   { cLow: 91, cHigh: 120, iLow: 201, iHigh: 300, label: "Poor" },
  //   { cLow: 121, cHigh: 250, iLow: 301, iHigh: 400, label: "Very Poor" },
  //   { cLow: 251, cHigh: Infinity, iLow: 401, iHigh: 500, label: "Severe" },
  // ];

  // const PM10_BREAKPOINTS = [
  //   { cLow: 0, cHigh: 50, iLow: 0, iHigh: 50, label: "Good" },
  //   { cLow: 51, cHigh: 100, iLow: 51, iHigh: 100, label: "Satisfactory" },
  //   { cLow: 101, cHigh: 250, iLow: 101, iHigh: 200, label: "Moderate" },
  //   { cLow: 251, cHigh: 350, iLow: 201, iHigh: 300, label: "Poor" },
  //   { cLow: 351, cHigh: 430, iLow: 301, iHigh: 400, label: "Very Poor" },
  //   { cLow: 431, cHigh: Infinity, iLow: 401, iHigh: 500, label: "Severe" },
  // ];

  // const NO2_BREAKPOINTS = [
  //   { cLow: 0, cHigh: 40, iLow: 0, iHigh: 50, label: "Good" },
  //   { cLow: 41, cHigh: 80, iLow: 51, iHigh: 100, label: "Satisfactory" },
  //   { cLow: 81, cHigh: 180, iLow: 101, iHigh: 200, label: "Moderate" },
  //   { cLow: 181, cHigh: 280, iLow: 201, iHigh: 300, label: "Poor" },
  //   { cLow: 281, cHigh: 400, iLow: 301, iHigh: 400, label: "Very Poor" },
  //   { cLow: 401, cHigh: Infinity, iLow: 401, iHigh: 500, label: "Severe" },
  // ];

  // const SO2_BREAKPOINTS = [
  //   { cLow: 0, cHigh: 40, iLow: 0, iHigh: 50, label: "Good" },
  //   { cLow: 41, cHigh: 80, iLow: 51, iHigh: 100, label: "Satisfactory" },
  //   { cLow: 81, cHigh: 380, iLow: 101, iHigh: 200, label: "Moderate" },
  //   { cLow: 381, cHigh: 800, iLow: 201, iHigh: 300, label: "Poor" },
  //   { cLow: 801, cHigh: 1600, iLow: 301, iHigh: 400, label: "Very Poor" },
  //   { cLow: 1601, cHigh: Infinity, iLow: 401, iHigh: 500, label: "Severe" },
  // ];

  // const O3_BREAKPOINTS = [
  //   { cLow: 0, cHigh: 50, iLow: 0, iHigh: 50, label: "Good" },
  //   { cLow: 51, cHigh: 100, iLow: 51, iHigh: 100, label: "Satisfactory" },
  //   { cLow: 101, cHigh: 168, iLow: 101, iHigh: 200, label: "Moderate" },
  //   { cLow: 169, cHigh: 208, iLow: 201, iHigh: 300, label: "Poor" },
  //   { cLow: 209, cHigh: 748, iLow: 301, iHigh: 400, label: "Very Poor" },
  //   { cLow: 749, cHigh: Infinity, iLow: 401, iHigh: 500, label: "Severe" },
  // ];

  // const NH3_BREAKPOINTS = [
  //   { cLow: 0, cHigh: 200, iLow: 0, iHigh: 50, label: "Good" },
  //   { cLow: 201, cHigh: 400, iLow: 51, iHigh: 100, label: "Satisfactory" },
  //   { cLow: 401, cHigh: 800, iLow: 101, iHigh: 200, label: "Moderate" },
  //   { cLow: 801, cHigh: 1200, iLow: 201, iHigh: 300, label: "Poor" },
  //   { cLow: 1201, cHigh: 1800, iLow: 301, iHigh: 400, label: "Very Poor" },
  //   { cLow: 1801, cHigh: Infinity, iLow: 401, iHigh: 500, label: "Severe" },
  // ];

  // const CO_BREAKPOINTS = [
  //   { cLow: 0, cHigh: 1, iLow: 0, iHigh: 50, label: "Good" },
  //   { cLow: 1.01, cHigh: 2, iLow: 51, iHigh: 100, label: "Satisfactory" },
  //   { cLow: 2.01, cHigh: 10, iLow: 101, iHigh: 200, label: "Moderate" },
  //   { cLow: 10.01, cHigh: 17, iLow: 201, iHigh: 300, label: "Poor" },
  //   { cLow: 17.01, cHigh: 34, iLow: 301, iHigh: 400, label: "Very Poor" },
  //   { cLow: 34.01, cHigh: Infinity, iLow: 401, iHigh: 500, label: "Severe" },
  // ];

  // function calculateAQIFromAllPollutants(components) {
  //   const subAQIs = [];

  //   if (components.pm2_5 != null) {
  //     subAQIs.push(calculateSubAQI(components.pm2_5, PM25_BREAKPOINTS));
  //   }

  //   if (components.pm10 != null) {
  //     subAQIs.push(calculateSubAQI(components.pm10, PM10_BREAKPOINTS));
  //   }

  //   if (components.no2 != null) {
  //     subAQIs.push(calculateSubAQI(components.no2, NO2_BREAKPOINTS));
  //   }

  //   if (components.so2 != null)
  //     subAQIs.push(calculateSubAQI(components.so2, SO2_BREAKPOINTS));

  //   if (components.o3 != null)
  //     subAQIs.push(calculateSubAQI(components.o3, O3_BREAKPOINTS));

  //   if (components.nh3 != null)
  //     subAQIs.push(calculateSubAQI(components.nh3, NH3_BREAKPOINTS));

  //   if (components.co != null)
  //     subAQIs.push(calculateSubAQI(components.co, CO_BREAKPOINTS));

  //   // Worst AQI wins
  //   return subAQIs.reduce((worst, current) =>
  //     current.aqi > worst.aqi ? current : worst
  //   );
  // }

  useEffect(() => {
    if (userName === "kundusandip") {
      setDataAnalyst(true);
    }
  }, []);

  function calculateSubAQI(concentration, breakpoints) {
    if (concentration == null || isNaN(concentration)) {
      return { aqi: 0, label: "Unknown" };
    }

    const bp = breakpoints.find(
      (b) => concentration >= b.cLow && concentration <= b.cHigh
    );

    if (!bp) {
      return { aqi: 0, label: "Unknown" };
    }

    const aqi =
      ((bp.iHigh - bp.iLow) / (bp.cHigh - bp.cLow)) *
      (concentration - bp.cLow) +
      bp.iLow;

    return {
      aqi: Math.round(aqi),
      label: bp.label,
    };
  }

  const PM25_BREAKPOINTS = [
    { cLow: 0, cHigh: 30, iLow: 0, iHigh: 50, label: "Good" },
    { cLow: 31, cHigh: 60, iLow: 51, iHigh: 100, label: "Satisfactory" },
    { cLow: 61, cHigh: 90, iLow: 101, iHigh: 200, label: "Moderate" },
    { cLow: 91, cHigh: 120, iLow: 201, iHigh: 300, label: "Poor" },
    { cLow: 121, cHigh: 250, iLow: 301, iHigh: 400, label: "Very Poor" },
    { cLow: 251, cHigh: Infinity, iLow: 401, iHigh: 500, label: "Severe" },
  ];

  const PM10_BREAKPOINTS = [
    { cLow: 0, cHigh: 50, iLow: 0, iHigh: 50, label: "Good" },
    { cLow: 51, cHigh: 100, iLow: 51, iHigh: 100, label: "Satisfactory" },
    { cLow: 101, cHigh: 250, iLow: 101, iHigh: 200, label: "Moderate" },
    { cLow: 251, cHigh: 350, iLow: 201, iHigh: 300, label: "Poor" },
    { cLow: 351, cHigh: 430, iLow: 301, iHigh: 400, label: "Very Poor" },
    { cLow: 431, cHigh: Infinity, iLow: 401, iHigh: 500, label: "Severe" },
  ];

  const NO2_BREAKPOINTS = [
    { cLow: 0, cHigh: 40, iLow: 0, iHigh: 50, label: "Good" },
    { cLow: 41, cHigh: 80, iLow: 51, iHigh: 100, label: "Satisfactory" },
    { cLow: 81, cHigh: 180, iLow: 101, iHigh: 200, label: "Moderate" },
    { cLow: 181, cHigh: 280, iLow: 201, iHigh: 300, label: "Poor" },
    { cLow: 281, cHigh: 400, iLow: 301, iHigh: 400, label: "Very Poor" },
    { cLow: 401, cHigh: Infinity, iLow: 401, iHigh: 500, label: "Severe" },
  ];

  const SO2_BREAKPOINTS = [
    { cLow: 0, cHigh: 40, iLow: 0, iHigh: 50, label: "Good" },
    { cLow: 41, cHigh: 80, iLow: 51, iHigh: 100, label: "Satisfactory" },
    { cLow: 81, cHigh: 380, iLow: 101, iHigh: 200, label: "Moderate" },
    { cLow: 381, cHigh: 800, iLow: 201, iHigh: 300, label: "Poor" },
    { cLow: 801, cHigh: 1600, iLow: 301, iHigh: 400, label: "Very Poor" },
    { cLow: 1601, cHigh: Infinity, iLow: 401, iHigh: 500, label: "Severe" },
  ];

  const O3_BREAKPOINTS = [
    { cLow: 0, cHigh: 50, iLow: 0, iHigh: 50, label: "Good" },
    { cLow: 51, cHigh: 100, iLow: 51, iHigh: 100, label: "Satisfactory" },
    { cLow: 101, cHigh: 168, iLow: 101, iHigh: 200, label: "Moderate" },
    { cLow: 169, cHigh: 208, iLow: 201, iHigh: 300, label: "Poor" },
    { cLow: 209, cHigh: 748, iLow: 301, iHigh: 400, label: "Very Poor" },
    { cLow: 749, cHigh: Infinity, iLow: 401, iHigh: 500, label: "Severe" },
  ];

  const NH3_BREAKPOINTS = [
    { cLow: 0, cHigh: 200, iLow: 0, iHigh: 50, label: "Good" },
    { cLow: 201, cHigh: 400, iLow: 51, iHigh: 100, label: "Satisfactory" },
    { cLow: 401, cHigh: 800, iLow: 101, iHigh: 200, label: "Moderate" },
    { cLow: 801, cHigh: 1200, iLow: 201, iHigh: 300, label: "Poor" },
    { cLow: 1201, cHigh: 1800, iLow: 301, iHigh: 400, label: "Very Poor" },
    { cLow: 1801, cHigh: Infinity, iLow: 401, iHigh: 500, label: "Severe" },
  ];

  const CO_BREAKPOINTS = [
    { cLow: 0, cHigh: 1, iLow: 0, iHigh: 50, label: "Good" },
    { cLow: 1.01, cHigh: 2, iLow: 51, iHigh: 100, label: "Satisfactory" },
    { cLow: 2.01, cHigh: 10, iLow: 101, iHigh: 200, label: "Moderate" },
    { cLow: 10.01, cHigh: 17, iLow: 201, iHigh: 300, label: "Poor" },
    { cLow: 17.01, cHigh: 34, iLow: 301, iHigh: 400, label: "Very Poor" },
    { cLow: 34.01, cHigh: Infinity, iLow: 401, iHigh: 500, label: "Severe" },
  ];

  function getWeatherText(main, pm25, visibility) {
    // API already says Haze
    if (main === "Haze") return "Hazy";
    // Pollution based haze
    if (pm_25 > 150 || visibility < 2000) {
      return "Severe Haze";
    }
    if (pm_25 > 60 || visibility < 5000) {
      return "Haze";
    }
    // Normal weather
    if (main === "Clear") return "Sunny";
    if (main === "Clouds") return "Partly Cloudy";
    if (main === "Rain") return "Rainy";
    if (main === "Mist" || main === "Fog") return "Foggy";
    return main;
  }

  function calculateAQIFromAllPollutants(components) {
    const subAQIs = [];

    if (components.pm2_5 != null)
      subAQIs.push(calculateSubAQI(components.pm2_5, PM25_BREAKPOINTS));

    if (components.pm10 != null)
      subAQIs.push(calculateSubAQI(components.pm10, PM10_BREAKPOINTS));

    if (components.no2 != null)
      subAQIs.push(calculateSubAQI(components.no2, NO2_BREAKPOINTS));

    if (components.so2 != null)
      subAQIs.push(calculateSubAQI(components.so2, SO2_BREAKPOINTS));

    if (components.o3 != null)
      subAQIs.push(calculateSubAQI(components.o3, O3_BREAKPOINTS));

    if (components.nh3 != null)
      subAQIs.push(calculateSubAQI(components.nh3, NH3_BREAKPOINTS));

    // CO: µg/m³ → mg/m³
    if (components.co != null) {
      const co_mg = components.co / 1000;
      subAQIs.push(calculateSubAQI(co_mg, CO_BREAKPOINTS));
    }

    return subAQIs.reduce(
      (worst, current) => (current.aqi > worst.aqi ? current : worst),
      { aqi: 0, label: "Good" }
    );
  }

  const fetchDataByCity = async (cityName) => {
    try {
      setLoading(true);
      const res = await axios.get(`${BACKEND_API}/api/weather/weatherData/${cityName}`);
      setData(res.data);
      components = res.data.pollution.list[0].components;
      const airQuality = calculateAQIFromAllPollutants(components);
      visibility = res.data.weather.visibility;
      windSpeed = res.data.weather.wind.speed;
      clouds = res.data.weather.clouds;
      main = res.data.weather.weather[0].main;
      const weatherText = getWeatherText(main, pm_25, visibility);
      setweatherConditions(weatherText);
      setAQI(airQuality.aqi);
      setAQIlabel(airQuality.label);
    } catch (err) {
      alert("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const detectLocation = () => {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          try {
            const res = await axios.get(
              `${BACKEND_API}/api/weather/reverse-geocode?lat=${latitude}&lon=${longitude}`
            );
            const data = res.data;
            console.log(res.data);

            fetchDataByCity(
              data.address.city || data.address.town || DEFAULT_CITY
            );
          } catch (err) {
            fetchDataByCity(DEFAULT_CITY);
          }
        },
        (error) => {
          console.log("Geolocation error:", error);
          fetchDataByCity(DEFAULT_CITY);
        }
      );
    };
    detectLocation();
  }, []);

  // useeffect for contextMenu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (contextRef.current && !contextRef.current.contains(event.target)) {
        closeContextMenu();
      }
    };

    if (contextMenu.show) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [contextMenu.show]);

  const handleMouseMove = (e) => {
    e.preventDefault();
    const newWidth = (e.clientX / window.innerWidth) * 100;
    if (newWidth >= 30 && newWidth <= 95) {
      setSearchbarWidth(newWidth);
    }
  };

  const handleMouseUp = () => {
    setDragStyle("");
    setBarStyle("");
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  // open context menu
  const openContextMenu = (event) => {
    const rect = event.target.getBoundingClientRect();
    let positionX = rect.left;
    let positionY = rect.top;
    const menuHeight = 100; // Approximate height of context menu
    const menuWidth = 170; // Approximate width of context menu
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    // Adjust vertically if overflowing bottom
    if (rect.top + menuHeight > viewportHeight) {
      positionY = rect.top - menuHeight;
    } else {
      positionY = -80 + rect.top;
    }
    // Adjust horizontally if overflowing right
    if (rect.left + menuWidth > viewportWidth) {
      positionX = rect.right - menuWidth;
    }
    setOriginalY(positionY);
    setContextMenu({
      show: true,
      x: positionX,
      y: positionY,
    });
    setMenuAnimation(false);
    setTimeout(() => setMenuAnimation(true), 300);
  };

  // close context menu
  const closeContextMenu = () => {
    setContextMenu({
      show: false,
      x: 0,
      y: 0,
    });
  };

  const showHistory = () => {
    if (userName) {
    } else {
      setDilogueBox(true)
      errorMessageFunc("If you want to show history about you, you have to login first");
    }
  }

  const downloadData = () => {
    if (userName) {
      navigate("/download");
    } else {
      setDilogueBox(true)
      errorMessageFunc("If you want to download data, you have to login first");
    }
  };

  const logout = async () => {
    if (userName) {
      const response = await axios.post(
        `${BACKEND_API}/api/weather/logout`,
        { userName },
        {
          withCredentials: true,
        }
      );
      navigate("/sign_in");
      dispatch(clearUser());
    }
    else {
      setDilogueBox(true)
      errorMessageFunc("If you want to logout, you have to login first on your account");
    }
  };

  const onClose = () => {
    if (errorMessage) {
      navigate("/sign_in");
      setDilogueBox(false);
    }
  }

  const errorMessageFunc = (errorsms) => {
    setErrorMessage(errorsms);
  }

  return (
    <div>
      {loading ? (
        <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-950">
          <style>{`
    @keyframes pulse-ring {
      0%   { transform: scale(0.8); opacity: 1; }
      100% { transform: scale(2);   opacity: 0; }
    }
    @keyframes fade-up {
      0%   { opacity: 0; transform: translateY(8px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    @keyframes dot-bounce {
      0%, 80%, 100% { opacity: 0.3; transform: scaleY(0.6); }
      40%           { opacity: 1;   transform: scaleY(1); }
    }
    .pulse-ring-1 { animation: pulse-ring 1.8s ease-out infinite; }
    .pulse-ring-2 { animation: pulse-ring 1.8s ease-out infinite; animation-delay: 0.6s; }
    .fade-up-text { animation: fade-up 0.6s ease forwards; }
    .dot-1 { animation: dot-bounce 1.2s ease-in-out infinite; }
    .dot-2 { animation: dot-bounce 1.2s ease-in-out infinite; animation-delay: 0.15s; }
    .dot-3 { animation: dot-bounce 1.2s ease-in-out infinite; animation-delay: 0.3s; }
  `}</style>

          {/* Spinner */}
          <div className="relative w-14 h-14 flex items-center justify-center mb-7">
            <span className="pulse-ring-1 absolute w-14 h-14 rounded-full border-2 border-orange-500" />
            <span className="pulse-ring-2 absolute w-14 h-14 rounded-full border-2 border-orange-500" />
            <span className="absolute w-14 h-14 rounded-full border-[3px] border-slate-800 border-t-orange-500 border-r-orange-500 animate-[spin_0.9s_cubic-bezier(0.4,0,0.2,1)_infinite]" />
            <span className="absolute w-9 h-9 rounded-full border-2 border-slate-800 border-b-orange-400 animate-[spin_0.7s_cubic-bezier(0.4,0,0.2,1)_infinite_reverse]" />
          </div>

          {/* Text */}
          <p className="fade-up-text text-slate-200 text-sm font-medium tracking-wide mb-2">
            Loading
          </p>

          {/* Dot bar */}
          <div className="flex items-center gap-1">
            <span className="dot-1 w-1.5 h-3.5 bg-slate-600 rounded-full" />
            <span className="dot-2 w-1.5 h-3.5 bg-slate-600 rounded-full" />
            <span className="dot-3 w-1.5 h-3.5 bg-slate-600 rounded-full" />
          </div>
        </div>
      ) : (<div>
        <div className="w-screen min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden">
          {data ? (
            <div className="max-w-2xl xl:max-w-5xl mx-auto px-4 md:px-8 pb-24">

              {/* ── Top bar ── */}
              <div className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-xl py-3 flex items-center gap-2">
                <span className="text-orange-400 font-extrabold text-[15px] md:text-lg tracking-tight shrink-0 select-none">
                  ClimaSphere
                </span>

                <div className="flex-1 flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-full px-4 h-11 focus-within:border-slate-500 transition-colors">
                  <button
                    onClick={() => city.trim() && fetchDataByCity(city)}
                    className="text-slate-400 flex items-center shrink-0"
                  >
                    <AiOutlineSearch size={17} />
                  </button>
                  <input
                    type="text"
                    value={city}
                    placeholder="Search city…"
                    onChange={(e) => setCity(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && city.trim() && fetchDataByCity(city)}
                    className="flex-1 bg-transparent outline-none text-slate-100 placeholder-slate-500 text-sm"
                  />
                </div>

                <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-800 border border-slate-700 text-slate-400 hover:text-slate-100 hover:border-slate-500 transition-colors">
                  <MdAdd size={18} />
                </button>

                <div className="relative">
                  <button
                    onClick={openContextMenu}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-800 border border-slate-700 text-slate-400 hover:text-slate-100 hover:border-slate-500 transition-colors"
                  >
                    <MdSettings size={18} />
                  </button>

                  {contextMenu.show && (
                    <div
                      ref={contextRef}
                      className={`absolute top-12 right-0 z-50 min-w-[11rem] bg-slate-800 border border-slate-700 rounded-2xl p-2 shadow-2xl transition-all duration-200 ${menuAnimation ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
                        }`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {avatar ? (
                        <div className="flex items-center gap-2 px-3 py-2 mb-1">
                          <img src={avatar} className="w-7 h-7 rounded-full object-cover" alt="avatar" />
                          <span className="font-semibold text-sm text-slate-100">{fullName}</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => navigate("/sign_up")}
                          className="w-full text-left text-sm text-slate-200 px-3 py-2 rounded-xl hover:bg-slate-700 transition-colors"
                        >
                          Sign Up
                        </button>
                      )}
                      <button
                        onClick={() => navigate("/sign_in")}
                        className="w-full text-left text-sm text-slate-200 px-3 py-2 rounded-xl hover:bg-slate-700 transition-colors"
                      >
                        Sign In
                      </button>
                      <div className="h-px bg-slate-700 my-1" />
                      <button
                        onClick={downloadData}
                        className="w-full text-left text-sm text-slate-200 px-3 py-2 rounded-xl hover:bg-slate-700 transition-colors"
                      >
                        Download Data
                      </button>
                      <button
                        className="w-full text-left text-sm text-slate-200 px-3 py-2 rounded-xl hover:bg-slate-700 transition-colors"
                        onClick={showHistory}
                      >
                        History
                      </button>
                      <div className="h-px bg-slate-700 my-1" />
                      <button
                        onClick={logout}
                        className="w-full text-left text-sm text-red-400 px-3 py-2 rounded-xl hover:bg-slate-700 transition-colors"
                      >
                        Log Out
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* ── Desktop: two-column layout ── */}
              <div className="xl:grid xl:grid-cols-2 xl:gap-8 xl:mt-8">

                {/* LEFT COLUMN */}
                <div>
                  {/* ── City + date ── */}
                  <div className="mt-6 xl:mt-0 flex justify-between items-start">
                    <div>
                      <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-100">
                        {data.weather.name}
                      </h1>
                      <p className="text-slate-400 text-xs md:text-sm mt-1">
                        {new Date().toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <span
                      className={`mt-1 px-3 py-1 rounded-full text-xs font-semibold ${AQI <= 100
                        ? "bg-emerald-500/20 text-emerald-400"
                        : AQI <= 150
                          ? "bg-amber-500/20 text-amber-400"
                          : "bg-red-500/20 text-red-400"
                        }`}
                    >
                      AQI {AQI}
                    </span>
                  </div>

                  {/* ── Big temperature ── */}
                  <div className="flex justify-center xl:justify-start mt-6">
                    <div className="relative">
                      <span className="text-[9rem] md:text-[11rem] xl:text-[13rem] font-bold tracking-tighter leading-none text-slate-100">
                        {Math.round(data.weather.main.temp)}
                      </span>
                      <span className="absolute top-6 -right-6 md:-right-8 text-4xl md:text-5xl font-light text-slate-400">
                        °
                      </span>
                    </div>
                  </div>

                  {/* ── Condition + AQI label ── */}
                  <div className="flex flex-col items-center xl:items-start gap-2 mt-3">
                    <span className="bg-orange-500/15 text-orange-400 text-sm font-medium px-4 py-1 rounded-full">
                      {weatherConditions}
                    </span>
                    <span className="text-base font-semibold text-slate-100">{AQIlabel}</span>
                  </div>
                </div>

                {/* RIGHT COLUMN */}
                <div className="flex flex-col gap-4 xl:justify-center">

                  {/* ── AQI card ── */}
                  <div className="mt-7 xl:mt-0 bg-slate-800 border border-slate-700 rounded-2xl p-5">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-4">
                      Air Quality Index
                    </p>
                    <div className="flex items-center gap-5">
                      <div className="relative shrink-0 w-[90px] h-[90px] md:w-[110px] md:h-[110px]">
                        <svg width="100%" height="100%" viewBox="0 0 90 90" className="-rotate-90">
                          <circle cx="45" cy="45" r="36" fill="none" stroke="#1e293b" strokeWidth="6" />
                          <circle
                            cx="45" cy="45" r="36"
                            fill="none"
                            stroke={
                              AQI <= 50 ? "#34d399"
                                : AQI <= 100 ? "#a3e635"
                                  : AQI <= 150 ? "#fbbf24"
                                    : AQI <= 200 ? "#f87171"
                                      : "#dc2626"
                            }
                            strokeWidth="6"
                            strokeLinecap="round"
                            strokeDasharray={`${(Math.min(AQI / 300, 1) * 2 * Math.PI * 36).toFixed(1)} ${(2 * Math.PI * 36).toFixed(1)}`}
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-xl font-bold text-slate-100 leading-none">{AQI}</span>
                          <span className="text-[9px] text-slate-400 mt-0.5">AQI</span>
                        </div>
                      </div>

                      <div className="flex-1">
                        <span
                          className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mb-2 ${AQI <= 100
                            ? "bg-emerald-500/20 text-emerald-400"
                            : AQI <= 150
                              ? "bg-amber-500/20 text-amber-400"
                              : "bg-red-500/20 text-red-400"
                            }`}
                        >
                          {AQIlabel}
                        </span>
                        <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
                          {AQI <= 50
                            ? "Air quality is satisfactory."
                            : AQI <= 100
                              ? "Acceptable air quality."
                              : AQI <= 150
                                ? "Breathing discomfort to people with lung disease such as asthma."
                                : AQI <= 200
                                  ? "Unhealthy for general population."
                                  : "Very unhealthy conditions."}
                        </p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

          ) : (
            /* ── Empty state ── */
            <div className="min-h-screen flex flex-col items-center justify-center px-8 gap-6">
              <div className="text-center">
                <div className="w-[10rem] md:w-[15rem] mx-auto">
                  <img src="/WeatherIcon.png" alt="" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-100">ClimaSphere</h2>
                <p className="text-slate-400 text-sm mt-1">Real-time weather &amp; air quality</p>
              </div>
              <div className="w-full max-w-xs md:max-w-sm flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-full px-4 h-12 focus-within:border-slate-500 transition-colors">
                <AiOutlineSearch className="text-slate-400 shrink-0" size={18} />
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && city.trim() && fetchDataByCity(city)}
                  placeholder="Enter city name"
                  className="flex-1 bg-transparent outline-none text-slate-100 placeholder-slate-500"
                />
              </div>
              <p className="text-xs text-slate-500">Press Enter to search</p>
            </div>
          )}
        </div>

        {/* ── Error Dialog ── */}
        {dilogueBox && (
          <>
            <style>{`
          @keyframes modal-pop {
            0%   { opacity: 0; transform: scale(0.85) translateY(16px); }
            100% { opacity: 1; transform: scale(1) translateY(0); }
          }
          @keyframes overlay-fade {
            0%   { opacity: 0; }
            100% { opacity: 1; }
          }
          .modal-overlay { animation: overlay-fade 0.25s ease forwards; }
          .modal-box     { animation: modal-pop 0.3s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        `}</style>
            <div className="fixed inset-0 z-50 flex items-center justify-center modal-overlay">
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
              <div className="relative bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-8 w-[90%] max-w-md text-center modal-box">
                <div className="w-12 h-12 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center mx-auto mb-4">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                </div>
                <h2 className="text-base font-semibold text-red-400 mb-2">Error</h2>
                <p className="text-slate-400 text-sm mb-6 leading-relaxed">{errorMessage}</p>
                <button
                  onClick={onClose}
                  className="w-full bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-semibold text-sm h-11 rounded-xl transition-all duration-200"
                >
                  OK
                </button>
              </div>
            </div>
          </>
        )}
        <Outlet />
        <ButtomNavbar />
      </div>)}</div>
  );
}

export default Homepage;
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { API } from "../BackendApi";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { MdSettings, MdAdd } from "react-icons/md";
import AirQualityCard from "./AirQualityCard.jsx";
import { AiOutlineSearch } from "react-icons/ai";
import { clearUser } from "../features/userSlice.js";
import WeatherChart from "./graph.jsx";
import {
  HiOutlineHome,
  HiHome,
  HiOutlinePlusCircle,
  HiPlusCircle,
  HiOutlineChatBubbleLeft,
  HiChatBubbleLeft,
} from "react-icons/hi2";

function Homepage() {
  const [city, setCity] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const DEFAULT_CITY = "Delhi";
  const { userName, fullName, avatar, userProffesion } = useSelector(
    (state) => state.user
  );
  const navigate = useNavigate();
  let pm_25;
  let visibility;
  let main;
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

  useEffect(() => {
    console.log(avatar);
  }, [avatar]);

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

  /* =========================
   2. BREAKPOINT DEFINITIONS
   (CPCB – INDIA)
   ========================= */

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

  /* =========================
   3. FINAL AQI CALCULATION
   ========================= */

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
      const res = await axios.get(`${API}/api/weather/${cityName}`);
      console.log("Response", res);
      setData(res.data);
      console.log("Data", res.data);
      console.log("Data", res.data.pollution.list[0].components.pm2_5);
      components = res.data.pollution.list[0].components;
      const airQuality = calculateAQIFromAllPollutants(components);
      visibility = res.data.weather.visibility;
      main = res.data.weather.weather[0].main;
      const weatherText = getWeatherText(main, pm_25, visibility);

      console.log("Weather:", weatherText);
      setweatherConditions(weatherText);
      console.log("AQI:", airQuality.aqi, airQuality.label);
      setAQI(airQuality.aqi);
      console.log("Air quality:", airQuality.label);
      setAQIlabel(airQuality.label);
    } catch (err) {
      console.log("Error", err);
      alert("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const detectLocation = () => {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await axios.get(
            `${API}/api/reverse-geocode?lat=${latitude}&lon=${longitude}`
          );
          const data = await res.data;
          fetchDataByCity(data.address.city || data.address.town || "Detected");
        } catch (error) {
          console.log(error);
          fetchDataByCity(DEFAULT_CITY);
        }
      });
    };
    detectLocation();
  }, []);

  // useeffect for contextMenu
  useEffect(() => {
    console.log("stop");

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

  const downloadData = () => {
    if (userName) {
      navigate("/download");
    } else {
      alert("Please sign in to download data");
    }
  };

  const logout = async () => {
    const response = await axios.post(
      `${API}/api/weather/logout`,
      { userName },
      {
        withCredentials: true,
      }
    );
    navigate("/sign_in");
    dispatch(clearUser());
  };

  return (
    <div className="w-screen min-h-screen bg-[#4337e6] overflow-hidden text-white">
      {data ? (
        <div className="relative h-full w-full max-w-[80rem] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search bar */}
          <div className="fixed top-3 left-0 right-0 z-50 flex justify-center">
            <div className="bg-white h-[3rem] w-full max-w-[32rem] flex items-center rounded-3xl border shadow-md px-3">
              <button
                onClick={() => city.trim() && fetchDataByCity(city)}
                className="text-slate-600 mr-2">
                <AiOutlineSearch size={24} />
              </button>

              <input
                type="text"
                value={city}
                placeholder="Enter city name"
                onChange={(e) => setCity(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && city.trim() && fetchDataByCity(city)
                }
                className="flex-1 outline-none text-black placeholder-slate-400"
              />
            </div>
          </div>
          <div>
            <img
              src="/Title.png"
              alt=""
              className="w-[10rem] mt-[5rem] ml-[7rem]"
            />{" "}
          </div>

          {/* Content */}
          <div className="pt-20 pb-24">
            {/* Header */}
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-serif">{data.weather.name}</h1>

              <div className="flex gap-4">
                <button>
                  <MdAdd size={36} />
                </button>
                <button onClick={openContextMenu}>
                  <MdSettings size={34} />
                </button>
              </div>
            </div>

            {/* Context Menu */}
            {contextMenu.show && (
              <div
                ref={contextRef}
                className={`absolute z-50 w-[14rem] rounded-xl bg-white text-black shadow-2xl p-3 transition-all duration-300 ${
                  menuAnimation
                    ? "opacity-100 translate-y-14"
                    : "opacity-0 translate-y-0"
                }`}
                style={{ top: contextMenu.y, left: contextMenu.x }}
                onClick={(e) => e.stopPropagation()}>
                {avatar ? (
                  <div className="flex items-center gap-2 mb-3">
                    <img src={avatar} className="w-8 h-8 rounded-full" />
                    <span className="font-semibold">{fullName}</span>
                  </div>
                ) : (
                  <button
                    onClick={() => navigate("/sign_up")}
                    className="block w-full text-left mb-2">
                    Sign Up
                  </button>
                )}

                <button
                  onClick={() => navigate("/sign_in")}
                  className="block w-full text-left mb-2">
                  Sign In
                </button>
                <button
                  onClick={downloadData}
                  className="block w-full text-left mb-2">
                  Download Data
                </button>
                <button className="block w-full text-left mb-2">History</button>
                <button
                  onClick={logout}
                  className="block w-full text-left text-red-500">
                  Log out
                </button>
              </div>
            )}

            {/* Temperature Section */}
            <div className="flex flex-col items-center mt-16">
              <div className="relative">
                <h1 className="text-[5rem] sm:text-[6rem] font-bold">
                  {Math.round(data.weather.main.temp)}
                </h1>
                <span className="absolute text-3xl top-2 right-[-1.5rem]">
                  °
                </span>
              </div>

              <div className="flex gap-4 text-lg mt-4">
                <span>{weatherConditions}</span>
                <span>AQI : {AQI}</span>
              </div>

              <p className="mt-2 text-xl font-medium">{AQIlabel}</p>
            </div>

            {/* AQI Card */}
            <div className="flex justify-center mt-14">
              <div className="bg-white/20 backdrop-blur-md rounded-2xl mr-[3rem] p-6 w-full max-w-[26rem]">
                <AirQualityCard aqi={AQI} label={AQIlabel} />
              </div>
            </div>
          </div>

          {/* Bottom Navigation */}
          <nav className="fixed bottom-0 left-0 w-full bg-black flex justify-around items-center h-16 z-50">
            <button onClick={() => navigate("/")}>
              <HiHome className="text-3xl" />
            </button>

            <button
              onClick={() =>
                alert(
                  "Post reply of data analyst's insight feature is coming soon"
                )
              }>
              <HiPlusCircle className="text-3xl" />
            </button>

            <button
              onClick={() => alert("User-to-user chat feature is coming soon")}>
              <HiChatBubbleLeft className="text-3xl" />
            </button>
          </nav>
        </div>
      ) : (
        /* No Data Screen */
        <div className="flex justify-center pt-32 px-4">
          <div className="bg-white rounded-3xl w-full max-w-[28rem] flex items-center px-4 h-12 shadow-md">
            <AiOutlineSearch className="text-slate-600 mr-2" />
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && city.trim() && fetchDataByCity(city)
              }
              placeholder="Enter city name"
              className="flex-1 outline-none text-black"
            />
          </div>
        </div>
      )}
    </div>
  );
}
export default Homepage;

{
  /* <div
      className="w-screen min-h-screen bg-cover bg-center bg-no-repeat overflow-hidden"
      style={{ backgroundImage: "url('/bg-screen.png')" }}>
      {data ? (
        <div className="relative h-full w-full">
          {/* Search bar */
}
//       <div className="fixed top-0 z-50 bg-white h-[2.8rem] flex items-center mt-[0.5rem] ml-[0.9rem] mr-[0.9rem] rounded-3xl border-2">
//         <div className="relative">
//           <button
//             onClick={() => {
//               if (city.trim() !== "") {
//                 fetchDataByCity(city);
//               }
//             }}
//             className="absolute left-[0.7rem] text-slate-600">
//             <AiOutlineSearch size={28} />
//           </button>
//           <input
//             type="text"
//             value={city}
//             placeholder="Give city name"
//             onChange={(e) => setCity(e.target.value)}
//             onKeyDown={(e) => {
//               if (e.key === "Enter" && city.trim() !== "") {
//                 fetchDataByCity(city);
//               }
//             }}
//             className="placeholder-slate-400 text-[1.2rem] rounded-3xl pl-[3rem] w-[23rem] outline-none"
//           />
//         </div>
//       </div>
//       <div className="overflow-y-auto">
//         {" "}
//         {/* Area Name and Settings */}
//         <div className="flex justify-between pt-[5rem]">
//           {/* Area Name */}
//           <h1 className="text-[1.8rem] font-serif pl-[1rem]">
//             {data.weather.name}
//           </h1>
//           {/* Add new tab and Settings */}
//           <div className="flex gap-[1rem]  pr-[1rem]">
//             <button>
//               <MdAdd size={40} />
//             </button>
//             <button
//               onClick={(e) => {
//                 openContextMenu(e);
//               }}
//               className="">
//               <MdSettings size={37} />
//             </button>
//           </div>
//         </div>
//         {contextMenu.show && (
//           <div
//             ref={contextRef}
//             className={`absolute flex flex-col gap-[0.5rem] rounded-xl w-[13.4rem] h-[15rem] z-50 shadow-2xl border bg-slate-400 -translate-x-6 transition-all duration-300 ease-in-out ${
//               menuAnimation
//                 ? "opacity-100 translate-y-20"
//                 : "opacity-0 translate-y-0"
//             }`}
//             style={{
//               top: contextMenu.y,
//               left: contextMenu.x,
//             }}
//             onClick={(e) => e.stopPropagation()}>
//             <div>
//               {avatar ? (
//                 <div className="flex items-center">
//                   <img
//                     src={avatar}
//                     alt=""
//                     className="w-[2rem] h-[2rem] rounded-full mt-[0.5rem] ml-[0.9rem]"
//                   />{" "}
//                   <span className=" ml-[0.5rem] text-2xl">{fullName}</span>
//                 </div>
//               ) : (
//                 <button
//                   onClick={() => {
//                     navigate("/sign_up");
//                   }}
//                   className="pt-[0.5rem] pl-[1rem] text-left text-2xl">
//                   Sign Up
//                 </button>
//               )}
//             </div>
//             <button
//               onClick={() => {
//                 navigate("/sign_in");
//               }}
//               className="pt-[0.5rem] pl-[1rem] text-left text-2xl">
//               Sign In
//             </button>
//             <button
//               onClick={() => {
//                 downloadData();
//               }}
//               className="pt-[0.5rem] pl-[1rem] text-left text-2xl">
//               Download Data
//             </button>
//             <button className="pt-[0.5rem] pl-[1rem] text-left text-2xl">
//               History
//             </button>
//             <button
//               className="pt-[0.5rem] pl-[1rem] text-left text-2xl text-red-500"
//               onClick={() => {
//                 logout();
//               }}>
//               Log out
//             </button>
//           </div>
//         )}
//         {/*Temperature and conditions*/}
//         <div className="flex flex-col items-center mt-[4rem] text-black">
//           <div className="relative flex">
//             <h1 className="text-[5rem]">
//               {Math.round(data.weather.main.temp)}
//             </h1>
//             <h1 className="absolute text-[2rem] font-bold top-[0.4rem] left-[5.4rem]">
//               o
//             </h1>
//           </div>
//           <div className="flex text-[1.3rem] mt-[1rem] font-medium">
//             <div className="flex gap-[1rem]">
//               <h1 className="">{weatherConditions}</h1>
//               <h1 className="">Air quality : {AQI}</h1>
//             </div>
//           </div>
//           <p className="text-[1.3rem] mt-[0.7rem]">{AQIlabel}</p>
//         </div>
//         {/*Situation and quality of air by AQI meter*/}
//         <div className="flex justify-center mt-[4rem]">
//           <AirQualityCard aqi={AQI} label={AQIlabel} />
//         </div>
//         {/* <div className="w-full max-w-[70rem] mx-auto px-4 sm:px-6 lg:px-0">
//           <WeatherChart />
//         </div> */}
//       </div>
//       <nav className="fixed bottom-0 left-0 w-full bg-black border-t border-gray-700 flex justify-around items-center h-16 z-50">
//         {/* Home */}
//         <button onClick={() => navigate("/")}>
//           {active === "Home" ? (
//             <HiHome className="text-3xl text-white" />
//           ) : (
//             <HiOutlineHome
//               className="text-3xl text-white"
//               onClick={() => {
//                 navigate("/");
//               }}
//             />
//           )}
//         </button>

//         {/* Upload */}
//         <button onClick={() => navigate("/upload")}>
//           {active === "Upload" ? (
//             <HiPlusCircle className="text-3xl text-white" />
//           ) : (
//             <HiOutlinePlusCircle
//               className="text-3xl text-white"
//               onClick={() => {
//                 navigate("");
//               }}
//             />
//           )}
//         </button>

//         {/* Messages */}
//         <button onClick={() => navigate("/messages")}>
//           {active === "Messages" ? (
//             <HiChatBubbleLeft cclassName="text-3xl text-white" />
//           ) : (
//             <HiOutlineChatBubbleLeft className="text-3xl text-white" />
//           )}
//         </button>
//       </nav>
//     </div>
//   ) : (
//     <div className="text-center mt-20">
//       <div className="bg-white relative flex items-center mt-[3.9rem] ml-[0.9rem] mr-[0.9rem] rounded-3xl border-2">
//         <button
//           onClick={() => {
//             if (city.trim() !== "") {
//               fetchDataByCity(city);
//             }
//           }}
//           className="absolute left-[1rem] text-slate-600">
//           <AiOutlineSearch size={21} />
//         </button>

//         <input
//           type="text"
//           value={city}
//           placeholder="Give city name"
//           onChange={(e) => setCity(e.target.value)}
//           onKeyDown={(e) => {
//             if (e.key === "Enter" && city.trim() !== "") {
//               fetchDataByCity(city);
//             }
//           }}
//           className="placeholder-slate-400 pl-[3rem] text-[1rem] w-full h-[2.3rem] rounded-3xl outline-none"
//         />
//       </div>
//     </div>
//   )}
// </div> */}

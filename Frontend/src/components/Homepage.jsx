import { useState, useEffect } from "react";
import axios from "axios";
import { API } from "../BackendApi";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { MdSettings, MdAdd } from "react-icons/md";
import AirQualityCard from "./AirQualityCard.jsx";

function Homepage() {
  const [city, setCity] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const DEFAULT_CITY = "Delhi";
  const { userId, userName, userAvatar, userProffesion } = useSelector(
    (state) => state.user
  );
  const navigate = useNavigate();
  let pm_25;
  let visibility;
  let main;
  const [weatherConditions, setweatherConditions] = useState("");
  const [AQI, setAQI] = useState(0);
  const [AQIlabel, setAQIlabel] = useState("");
  let components = {};

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

  function calculateSubAQI(concentration, breakpoints) {
    const bp = breakpoints.find(
      (b) => concentration >= b.cLow && concentration <= b.cHigh
    );

    if (!bp) return { aqi: 500, label: "Severe" };

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

  function calculateAQIFromAllPollutants(components) {
    const subAQIs = [];

    if (components.pm2_5 != null) {
      subAQIs.push(calculateSubAQI(components.pm2_5, PM25_BREAKPOINTS));
    }

    if (components.pm10 != null) {
      subAQIs.push(calculateSubAQI(components.pm10, PM10_BREAKPOINTS));
    }

    if (components.no2 != null) {
      subAQIs.push(calculateSubAQI(components.no2, NO2_BREAKPOINTS));
    }

    if (components.so2 != null)
      subAQIs.push(calculateSubAQI(components.so2, SO2_BREAKPOINTS));

    if (components.o3 != null)
      subAQIs.push(calculateSubAQI(components.o3, O3_BREAKPOINTS));

    if (components.nh3 != null)
      subAQIs.push(calculateSubAQI(components.nh3, NH3_BREAKPOINTS));

    if (components.co != null)
      subAQIs.push(calculateSubAQI(components.co, CO_BREAKPOINTS));

    // Worst AQI wins
    return subAQIs.reduce((worst, current) =>
      current.aqi > worst.aqi ? current : worst
    );
  }

  const fetchDataByCity = async (cityName) => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/api/weather/${cityName}`);
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
      if (!navigator.geolocation) {
        setError("Geolocation not supported");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          try {
            const res = await axios.get(
              `${API}/api/reverse-geocode?lat=${latitude}&lon=${longitude}`
            );
            const data = await res.data;
            fetchDataByCity(
              data.address.city || data.address.town || "Detected"
            );
          } catch (error) {
            console.log(error);
            fetchDataByCity(DEFAULT_CITY);
          }
        },
        () => {
          // fallback manual entry
          const pin = prompt("Enter your PIN code:");
          if (pin && pin.length === 6) {
            setLocation(`PIN: ${pin}`);
            setError("");
          } else {
            setError("Invalid PIN code");
          }
        }
      );
    };
    detectLocation();
  }, []);

  const handleSearch = () => {
    if (city.trim() !== "") {
      fetchDataByCity(city);
    }
  };

  const downloadCSV = async () => {
    try {
      if (!userId) {
        navigate("/sign_in");
        alert("Please sign in to download the CSV.");
        return;
      }
      const res = await axios.get(`${API}/api/download-csv`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "weather_data.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.log("CSV download error", err);
    }
  };

  const sign_up = () => {
    navigate("/sign_up");
  };

  const sign_in = () => {
    navigate("/sign_in");
  };

  return (
    <div className=" w-[100vw] h-[100vh] bg-black">
      {data ? (
        <div>
          {/* 1st row */}
          <div className="flex justify-between text-white">
            {/* Area Name */}
            <h1 className="text-[1.8rem] font-serif pt-[1rem] pl-[1rem]">
              {data.weather.name}
            </h1>
            {/* Add new tab and Settings */}
            <div className="flex gap-[1rem] pt-[1rem] pr-[4.2rem]">
              <button>
                <MdAdd size={40} />
              </button>
              <button>
                <MdSettings size={37} />
              </button>
            </div>
          </div>
          {/* 2nd row */}
          <div className="flex flex-col">
            {/* Temperature */}
            <div className="relative flex justify-center">
              <h1 className="text-white text-[5rem] mt-[3rem] mr-[3rem]">
                {Math.round(data.weather.main.temp)}
              </h1>
              <h1 className="absolute text-white top-[3.6rem] left-[14.5rem] text-[2rem] font-bold">
                o
              </h1>
            </div>
            {/* Situation and quality of air*/}
            <div className="flex flex-col items-center mt-[1rem] mr-[3.5rem] text-[1.3rem] font-medium">
              <div className="flex gap-[1rem]">
                <h1 className="text-white">{weatherConditions}</h1>
                <h1 className="text-white">Air quality : {AQI}</h1>
              </div>
              <h1 className="text-white">{AQIlabel}</h1>
            </div>
            <div className="mt-[5rem] ml-[1.6rem]">
              <AirQualityCard aqi={AQI} label={AQIlabel} />
            </div>
          </div>
          {/* Third row */}
          <div></div>
        </div>
      ) : (
        <div className="text-center mt-20"></div>
      )}
    </div>
  );
}

export default Homepage;

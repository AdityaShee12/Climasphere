import { useState, useEffect } from "react";
import axios from "axios";
import { API } from "../BackendApi";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function Homepage() {
  const [city, setCity] = useState("");
  const [data, setData] = useState(null);
  const[loading, setLoading] = useState(false);
  const DEFAULT_CITY = "Delhi";
  const { userId, userName, userAvatar, userProffesion } = useSelector(
    (state) => state.user
  );
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch default city data on load
    fetchDataByCity(DEFAULT_CITY);
  }, []);

  // Fetch by city
  const fetchDataByCity = async (cityName) => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/api/weather/${cityName}`);
      setData(res.data);
      console.log("Data", res.data);
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-500 to-sky-300 p-6">
      {loading ? (
        <div className="flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            Fetching weather & pollution data...
          </p>
        </div>
      ) : (
        <div>
          {" "}
          <div className="flex gap-4 mb-6">
            <button
              onClick={sign_up}
              className="bg-white text-blue-600 font-semibold px-5 py-2 rounded-xl shadow hover:bg-blue-50 transition">
              Sign Up
            </button>
            <button
              onClick={sign_in}
              className="bg-white text-blue-600 font-semibold px-5 py-2 rounded-xl shadow hover:bg-blue-50 transition">
              Sign In
            </button>
          </div>
          {/* Header */}
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-8 text-center drop-shadow-md">
            Weather & Air Pollution Tracker
          </h1>
          {/* Search Bar */}
          <div className="flex gap-3 mb-8 w-full max-w-md">
            <input
              type="text"
              placeholder="Enter city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="flex-1 px-4 py-2 rounded-xl shadow-inner outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={handleSearch}
              className="bg-white text-blue-600 font-semibold px-6 py-2 rounded-xl shadow hover:bg-blue-50 transition">
              Search
            </button>
          </div>
          {/* Data Display */}
          {data && (
            <div className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-md text-gray-800">
              <div className="flex flex-col items-center mb-6">
                <p className="text-gray-500 text-sm">{data.weather.name}</p>
                <h2 className="text-6xl font-bold text-blue-600">
                  {Math.round(data.weather.main.temp)}°
                </h2>
                <p className="text-lg capitalize text-gray-600">
                  {data.weather.weather[0].description}
                </p>
                <p className="text-sm text-gray-500">
                  {data.weather.main.temp_min}° / {data.weather.main.temp_max}°
                </p>
              </div>

              {/* Weather Info */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 p-3 rounded-xl text-center">
                  <p className="text-sm text-gray-600">Humidity</p>
                  <p className="font-semibold">{data.weather.main.humidity}%</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-xl text-center">
                  <p className="text-sm text-gray-600">Coordinates</p>
                  <p className="font-semibold">
                    {data.weather.coord.lat}, {data.weather.coord.lon}
                  </p>
                </div>
              </div>

              {/* Pollution Info */}
              <h3 className="text-lg font-semibold mb-2 text-gray-800 border-b pb-1">
                Air Quality
              </h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-green-50 p-3 rounded-xl text-center">
                  <p className="text-sm text-gray-600">AQI</p>
                  <p className="font-semibold">
                    {data.pollution.list[0].main.aqi}
                  </p>
                </div>
                <div className="bg-green-50 p-3 rounded-xl text-center">
                  <p className="text-sm text-gray-600">CO</p>
                  <p className="font-semibold">
                    {data.pollution.list[0].components.co}
                  </p>
                </div>
                <div className="bg-green-50 p-3 rounded-xl text-center">
                  <p className="text-sm text-gray-600">NO₂</p>
                  <p className="font-semibold">
                    {data.pollution.list[0].components.no2}
                  </p>
                </div>
                <div className="bg-green-50 p-3 rounded-xl text-center">
                  <p className="text-sm text-gray-600">PM2.5</p>
                  <p className="font-semibold">
                    {data.pollution.list[0].components.pm2_5}
                  </p>
                </div>
                <div className="bg-green-50 p-3 rounded-xl text-center col-span-2">
                  <p className="text-sm text-gray-600">PM10</p>
                  <p className="font-semibold">
                    {data.pollution.list[0].components.pm10}
                  </p>
                </div>
              </div>

              {/* More Details */}
              <h3 className="text-lg font-semibold mb-2 text-gray-800 border-b pb-1">
                More Details
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {Object.entries(data.weather.main).map(([key, value]) => {
                  if (
                    ["temp", "temp_min", "temp_max", "humidity"].includes(key)
                  )
                    return null;
                  return (
                    <div
                      key={key}
                      className="bg-gray-100 p-3 rounded-xl text-center hover:bg-gray-200 transition">
                      <p className="capitalize">{key.replace("_", " ")}</p>
                      <p className="font-semibold">{value}</p>
                    </div>
                  );
                })}
                {Object.entries(data.pollution.list[0].components).map(
                  ([key, value]) => {
                    if (["co", "no2", "pm2_5", "pm10"].includes(key))
                      return null;
                    return (
                      <div
                        key={key}
                        className="bg-gray-100 p-3 rounded-xl text-center hover:bg-gray-200 transition">
                        <p className="uppercase">{key}</p>
                        <p className="font-semibold">{value}</p>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          )}
          {/* Download Button */}
          <button
            onClick={downloadCSV}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-xl shadow mt-6 transition">
            Download CSV
          </button>{" "}
        </div>
      )}
      {/* Auth Buttons */}
    </div>
  );
}

export default Homepage;

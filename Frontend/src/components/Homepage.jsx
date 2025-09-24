import { useState, useEffect } from "react";
import axios from "axios";

function Homepage() {
  const [city, setCity] = useState("");
  const [data, setData] = useState(null);
  const DEFAULT_CITY = "Delhi";

  // Fetch by city
  const fetchDataByCity = async (cityName) => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/weather/${cityName}`
      );
      setData(res.data);
    } catch (err) {
      console.log("Error", err);
      alert("Error fetching data");
    }
  };

  // Fetch by coordinates
  const fetchDataByCoords = async (lat, lon) => {
    try {
      const res = await axios.get(
        ` http://localhost:8000/api/weather/${lat},${lon}`
      );
      setData(res.data);
    } catch (err) {
      console.log("Error", err);
      alert("Error fetching data");
    }
  };

  // On mount → ask for location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchDataByCoords(latitude, longitude);
        },
        () => {
          fetchDataByCity(DEFAULT_CITY); // fallback
        }
      );
    } else {
      fetchDataByCity(DEFAULT_CITY); // fallback
    }
  }, []);

  const handleSearch = () => {
    if (city.trim() !== "") {
      fetchDataByCity(city);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-400 to-blue-200 p-6">
      <h1 className="text-3xl font-bold text-white mb-6">
        Weather & Air Pollution Tracker
      </h1>

      <div className="flex gap-2 mb-6 w-full max-w-md">
        <input
          type="text"
          placeholder="Enter city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="flex-1 px-4 py-2 rounded-xl shadow-md outline-none"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl shadow-md transition">
          Search
        </button>
      </div>

      {data && (
        <div className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-md">
          <div className="flex flex-col items-center">
            <p className="text-gray-500 text-sm">{data.weather.name}</p>
            <h2 className="text-6xl font-bold text-gray-800">
              {Math.round(data.weather.main.temp)}°
            </h2>
            <p className="text-lg capitalize text-gray-600">
              {data.weather.weather[0].description}
            </p>
            <p className="text-sm text-gray-500">
              {data.weather.main.temp_min}° / {data.weather.main.temp_max}°
            </p>
          </div>

          {/* Extra Info */}
          <div className="grid grid-cols-2 gap-4 mt-6 text-gray-700">
            <div className="p-3 rounded-xl bg-blue-50 text-center">
              <p className="text-sm">Humidity</p>
              <p className="font-semibold">{data.weather.main.humidity}%</p>
            </div>
            <div className="p-3 rounded-xl bg-blue-50 text-center">
              <p className="text-sm">Coordinates</p>
              <p className="font-semibold">
                {data.weather.coord.lat}, {data.weather.coord.lon}
              </p>
            </div>
          </div>

          {/* Pollution */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">
              Air Quality
            </h3>
            <div className="grid grid-cols-2 gap-4 text-gray-700">
              <div className="p-3 bg-green-50 rounded-xl text-center">
                <p className="text-sm">AQI</p>
                <p className="font-semibold">
                  {data.pollution.list[0].main.aqi}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-xl text-center">
                <p className="text-sm">CO</p>
                <p className="font-semibold">
                  {data.pollution.list[0].components.co}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-xl text-center">
                <p className="text-sm">NO₂</p>
                <p className="font-semibold">
                  {data.pollution.list[0].components.no2}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-xl text-center">
                <p className="text-sm">PM2.5</p>
                <p className="font-semibold">
                  {data.pollution.list[0].components.pm2_5}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-xl text-center col-span-2">
                <p className="text-sm">PM10</p>
                <p className="font-semibold">
                  {data.pollution.list[0].components.pm10}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Homepage;

import axios from "axios";
import Weather from "../models/weather.models.js"
import { Parser } from "json2csv";

const WEATHER_API = "http://api.openweathermap.org/data/2.5/weather";
const POLLUTION_API = "http://api.openweathermap.org/data/2.5/air_pollution";
const API_KEY = "5d0e7c16b9f4d577e463c5436404c021";

const weatherData = async (req, res) => {
    try {
        const city = req.params.cityName;

        const weatherRes = await axios.get(
            `${WEATHER_API}?q=${city}&appid=${API_KEY}&units=metric`
        );

        const { lon, lat } = weatherRes.data.coord;

        const pollutionRes = await axios.get(
            `${POLLUTION_API}?lat=${lat}&lon=${lon}&appid=${API_KEY}`
        );

        // Reverse geocode (state detect)
        const geoRes = await axios.get(
            `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`
        );

        const geo = geoRes.data[0];

        const data = await Weather.create({
            location: {
                country: {
                    code: weatherRes.data.sys.country,
                    name: geo.country || "India",
                },
                state: {
                    name: geo.state || "Unknown",
                },
                city: {
                    id: weatherRes.data.id,
                    name: weatherRes.data.name,
                },
            },

            coord: weatherRes.data.coord,
            weather: weatherRes.data.weather,
            mainWeather: weatherRes.data.main,
            visibility: weatherRes.data.visibility,
            wind: weatherRes.data.wind,
            clouds: weatherRes.data.clouds,
            base: weatherRes.data.base,
            dt: weatherRes.data.dt,
            timezone: weatherRes.data.timezone,
            sys: weatherRes.data.sys,
            cod: weatherRes.data.cod,

            pollution: {
                aqi: pollutionRes.data.list[0].main.aqi,
                components: pollutionRes.data.list[0].components,
                dt: pollutionRes.data.list[0].dt,
            },
        });

        res.json({
            weather: weatherRes.data,
            pollution: pollutionRes.data,
        });
    } catch (err) {
        res.status(500).json({ error: "Weather fetch failed" });
    }
};

const reverseGeocode = async (req, res) => {

    const { lat, lon } = req.query;

    try {
        const response = await axios.get(
            `https://nominatim.openstreetmap.org/reverse`,
            {
                params: {
                    lat: lat,
                    lon: lon,
                    format: "json"
                },
                headers: {
                    "User-Agent": "climasphere-app"
                }
            }
        );
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch location" });
    }
};

const downloadCSV = async (req, res) => {
    try {
        const data = await Weather.find().lean();

        if (!data || data.length === 0) {
            return res.status(404).json({ error: "No data found" });
        }

        const formattedData = data.map((item) => ({
            // 🌍 Location hierarchy (NEW)
            Country: item.location?.country?.name || item.sys?.country || "",
            "Country Code": item.location?.country?.code || "",
            State: item.location?.state?.name || "",
            City: item.location?.city?.name || item.name || "",

            // 📍 Geo
            Latitude: item.coord?.lat || "",
            Longitude: item.coord?.lon || "",

            // 🌦 Weather
            "Weather Condition": item.weather?.[0]?.main || "",
            "Weather Description": item.weather?.[0]?.description || "",
            "Temperature (°C)": item.mainWeather?.temp || "",
            "Feels Like (°C)": item.mainWeather?.feels_like || "",
            "Min Temp (°C)": item.mainWeather?.temp_min || "",
            "Max Temp (°C)": item.mainWeather?.temp_max || "",
            "Pressure (hPa)": item.mainWeather?.pressure || "",
            "Humidity (%)": item.mainWeather?.humidity || "",

            // 🌬 Wind & Cloud
            "Wind Speed (m/s)": item.wind?.speed || "",
            "Wind Direction (°)": item.wind?.deg || "",
            "Cloud Coverage (%)": item.clouds?.all || "",
            Visibility: item.visibility || "",

            // 🧪 Pollution
            "AQI": item.pollution?.aqi || "",
            "CO (µg/m³)": item.pollution?.components?.co || "",
            "NO (µg/m³)": item.pollution?.components?.no || "",
            "NO₂ (µg/m³)": item.pollution?.components?.no2 || "",
            "O₃ (µg/m³)": item.pollution?.components?.o3 || "",
            "SO₂ (µg/m³)": item.pollution?.components?.so2 || "",
            "PM2.5 (µg/m³)": item.pollution?.components?.pm2_5 || "",
            "PM10 (µg/m³)": item.pollution?.components?.pm10 || "",
            "NH₃ (µg/m³)": item.pollution?.components?.nh3 || "",

            // 🕒 Meta
            "City ID": item.cityId || "",
            "Weather Code": item.cod || "",
            "Record Created At": new Date(item.createdAt).toLocaleString(
                "en-IN",
                {
                    timeZone: "Asia/Kolkata",
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true,
                }
            ),
        }));

        const fields = Object.keys(formattedData[0]);
        const parser = new Parser({ fields });
        const csv = parser.parse(formattedData);

        res.header("Content-Type", "text/csv");
        res.attachment("weather_data.csv");
        res.send(csv);
    } catch (err) {
        console.error("CSV generation error:", err);
        res.status(500).json({ error: "Error generating CSV" });
    }
};

export { weatherData, reverseGeocode, downloadCSV };
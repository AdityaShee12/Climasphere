import express from "express";
import axios from "axios";
import cors from "cors";
import Weather from "./models/weatherModel.js";
import cron from "node-cron";
import connectDB from "./db/index.js";
import { Parser } from "json2csv";
import { API } from "../Frontend_API.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors({ origin: API, credentials: true }));
app.use(express.json());
const WEATHER_API = "https://api.openweathermap.org/data/2.5/weather";
const POLLUTION_API = "https://api.openweathermap.org/data/2.5/air_pollution";
const API_KEY = "5d0e7c16b9f4d577e463c5436404c021";

// Get weather by city name
app.get("/api/weather/:city", async (req, res) => {
  try {
    const city = req.params.city;

    const weatherRes = await axios.get(
      ` ${WEATHER_API}?q=${city}&appid=${API_KEY}&units=metric `
    );
    const { lon, lat } = weatherRes.data.coord;

    const pollutionRes = await axios.get(
      ` ${POLLUTION_API}?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    );

    const responseData = {
      weather: weatherRes.data,
      pollution: pollutionRes.data,
    };

    // Save to DB correctly
    await Weather.create({
      cityId: weatherRes.data.id,
      name: weatherRes.data.name,
      coord: weatherRes.data.coord,
      weather: weatherRes.data.weather,
      mainWeather: weatherRes.data.main,
      base: weatherRes.data.base,
      visibility: weatherRes.data.visibility,
      wind: weatherRes.data.wind,
      clouds: weatherRes.data.clouds,
      dt: weatherRes.data.dt,
      sys: weatherRes.data.sys,
      timezone: weatherRes.data.timezone,
      cod: weatherRes.data.cod,
      pollution: {
        aqi: pollutionRes.data.list[0].main.aqi,
        components: pollutionRes.data.list[0].components,
        dt: pollutionRes.data.list[0].dt,
      },
    });
    res.json(responseData);
  } catch (error) {
    console.error("Error fetching city:", error.message);
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
});

app.get("/api/reverse-geocode", async (req, res) => {
  const { lat, lon } = req.query;
  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
    );
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch location" });
  }
});

// Cron Job: Save India states data every 6 hours
const indianStates = [
  "Delhi",
  "Kolkata",
  "Mumbai",
  "Chennai",
  "Bengaluru",
  "Hyderabad",
  "Ahmedabad",
  "Jaipur",
  "Lucknow",
  "Patna",
  "Bhopal",
  "Ranchi",
  "Guwahati",
  "Bhubaneswar",
  "Chandigarh",
  "Shimla",
  "Dehradun",
  "Panaji",
];

app.get("/api/download-csv", async (req, res) => {
  try {
    const data = await Weather.find().lean();

    if (!data || data.length === 0) {
      return res.status(404).json({ error: "No data found" });
    }

    // Nested object flatten readable format for CSV
    const formattedData = data.map((item) => ({
      "City Name": item.name || "",
      Country: item.sys?.country || "",
      Latitude: item.coord?.lat || "",
      Longitude: item.coord?.lon || "",
      "Weather Condition": item.weather?.[0]?.main || "",
      "Weather Description": item.weather?.[0]?.description || "",
      "Temperature (°C)": item.mainWeather?.temp || "",
      "Feels Like (°C)": item.mainWeather?.feels_like || "",
      "Min Temp (°C)": item.mainWeather?.temp_min || "",
      "Max Temp (°C)": item.mainWeather?.temp_max || "",
      "Pressure (hPa)": item.mainWeather?.pressure || "",
      "Humidity (%)": item.mainWeather?.humidity || "",
      "Wind Speed (m/s)": item.wind?.speed || "",
      "Wind Direction (°)": item.wind?.deg || "",
      "Visibility (m)": item.visibility || "",
      "Cloud Coverage (%)": item.clouds?.all || "",
      "Air Quality Index (AQI)": item.pollution?.aqi|| "",
      "CO (µg/m³)": item.pollution?.components?.co || "",
      "NO (µg/m³)": item.pollution?.components?.no || "",
      "NO₂ (µg/m³)": item.pollution?.components?.no2 || "",
      "O₃ (µg/m³)": item.pollution?.components?.o3 || "",
      "SO₂ (µg/m³)": item.pollution?.components?.so2 || "",
      "PM2.5 (µg/m³)": item.pollution?.components?.pm2_5 || "",
      "PM10 (µg/m³)": item.pollution?.components?.pm10 || "",
      "NH₃ (µg/m³)": item.pollution?.components?.nh3 || "",
      "Sunrise Time": item.sys?.sunrise || "",
      "Sunset Time": item.sys?.sunset || "",
      "Timezone Offset": item.timezone || "",
      "Station Base": item.base || "",
      "Weather Code": item.cod || "",
      "City ID": item.cityId || "",
      "Record Created At": new Date(item.createdAt).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }),
    }));

    // CSV fields
    const fields = Object.keys(formattedData[0]);

    const opts = {
      fields,
      quote: "",
      delimiter: ",",
      header: true,
    };

    const parser = new Parser(opts);
    const csv = parser.parse(formattedData);

    res.header("Content-Type", "text/csv");
    res.attachment("weather_data.csv");
    res.send(csv);
  } catch (err) {
    console.error("CSV generation error:", err);
    res.status(500).json({ error: "Error generating CSV" });
  }
});

cron.schedule("0 */6 * * *", async () => {
  console.log("Running 6-hour cron job for Indian states");

  for (const city of indianStates) {
    try {
      const weatherRes = await axios.get(
        `${WEATHER_API}?q=${city}&appid=${API_KEY}&units=metric`
      );
      const { lon, lat } = weatherRes.data.coord;

      const pollutionRes = await axios.get(
        `${POLLUTION_API}?lat=${lat}&lon=${lon}&appid=${API_KEY}`
      );
      await Weather.create({
        cityId: weatherRes.data.id,
        name: weatherRes.data.name,
        coord: weatherRes.data.coord,
        weather: weatherRes.data.weather,
        mainWeather: weatherRes.data.main,
        base: weatherRes.data.base,
        visibility: weatherRes.data.visibility,
        wind: weatherRes.data.wind,
        clouds: weatherRes.data.clouds,
        dt: weatherRes.data.dt,
        sys: weatherRes.data.sys,
        timezone: weatherRes.data.timezone,
        cod: weatherRes.data.cod,
        pollution: {
          aqi: pollutionRes.data.list[0].main.aqi,
          components: pollutionRes.data.list[0].components,
          dt: pollutionRes.data.list[0].dt,
        },
      });
    } catch (err) {
      console.error(`Error saving ${city}:, err.message`);
    }
  }
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
  });

import express from "express";
import axios from "axios";
import cors from "cors";
import Weather from "./models/weatherModel.js";
import cron from "node-cron";
import connectDB from "./db/index.js";
const app = express();
app.use(cors());

const WEATHER_API = "https://api.openweathermap.org/data/2.5/weather";
const POLLUTION_API = "https://api.openweathermap.org/data/2.5/air_pollution";
const API_KEY = "5d0e7c16b9f4d577e463c5436404c021";

// ✅ Get weather by city name
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
      weather: weatherRes.data.weather, // array of weather objects
      mainWeather: weatherRes.data.main, // temp, feels_like, etc
      base: weatherRes.data.base,
      visibility: weatherRes.data.visibility,
      wind: weatherRes.data.wind,
      clouds: weatherRes.data.clouds,
      dt: weatherRes.data.dt,
      sys: weatherRes.data.sys,
      timezone: weatherRes.data.timezone,
      cod: weatherRes.data.cod,
      pollution: {
        aqi: pollutionRes.data.list[0].main.aqi, // direct extract
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

// ✅ Get weather by coordinates
app.get("/api/weather/:lat,:lon", async (req, res) => {
  try {
    const { lat, lon } = req.params;

    const weatherRes = await axios.get(
      ` ${WEATHER_API}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );

    const pollutionRes = await axios.get(
      `${POLLUTION_API}?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    );

    const responseData = {
      weather: weatherRes.data,
      pollution: pollutionRes.data,
    };

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
    console.error("Error fetching coords:", error.message);
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
});

// ✅ Cron Job: Save India states data every 6 hours
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

cron.schedule("0 */6 * * *", async () => {
  console.log("⏱ Running 6-hour cron job for Indian states...");

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

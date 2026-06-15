import axios from "axios";
import Weather from "./models/weather.models.js";
import cron from "node-cron";
import connectDB from "./db/index.js";
import { Parser } from "json2csv";
import dotenv from "dotenv";
import { server } from "./chatIO.js";
import { app } from "./app.js";

dotenv.config();

// const app = express();
// app.use(cors({ origin: "http://localhost:5173", credentials: true }));
// // "http://52.66.188.192:3000"
// app.use(express.json());

const WEATHER_API = "http://api.openweathermap.org/data/2.5/weather";
const POLLUTION_API = "http://api.openweathermap.org/data/2.5/air_pollution";
const API_KEY = "5d0e7c16b9f4d577e463c5436404c021";

app.get("/", (req, res) => {
  res.send("API is running successfully");
});


function normalizeIndiaLocation(loc) {
  if (loc.country === "India" && loc.city === loc.state) {
    return {
      ...loc,
      city: loc.state, // Delhi, Chandigarh, etc
    };
  }
  return loc;
}

// app.get("/api/weather/:cityName", async (req, res) => {
//   try {
//     const city = req.params.cityName;

//     const weatherRes = await axios.get(
//       `${WEATHER_API}?q=${city}&appid=${API_KEY}&units=metric`
//     );

//     const { lon, lat } = weatherRes.data.coord;

//     const pollutionRes = await axios.get(
//       `${POLLUTION_API}?lat=${lat}&lon=${lon}&appid=${API_KEY}`
//     );

//     // Reverse geocode (state detect)
//     const geoRes = await axios.get(
//       `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`
//     );

//     const geo = geoRes.data[0];

//     const data = await Weather.create({
//       location: {
//         country: {
//           code: weatherRes.data.sys.country,
//           name: geo.country || "India",
//         },
//         state: {
//           name: geo.state || "Unknown",
//         },
//         city: {
//           id: weatherRes.data.id,
//           name: weatherRes.data.name,
//         },
//       },

//       coord: weatherRes.data.coord,
//       weather: weatherRes.data.weather,
//       mainWeather: weatherRes.data.main,
//       visibility: weatherRes.data.visibility,
//       wind: weatherRes.data.wind,
//       clouds: weatherRes.data.clouds,
//       base: weatherRes.data.base,
//       dt: weatherRes.data.dt,
//       timezone: weatherRes.data.timezone,
//       sys: weatherRes.data.sys,
//       cod: weatherRes.data.cod,

//       pollution: {
//         aqi: pollutionRes.data.list[0].main.aqi,
//         components: pollutionRes.data.list[0].components,
//         dt: pollutionRes.data.list[0].dt,
//       },
//     });

//     console.log("Data", data);

//     res.json({
//       weather: weatherRes.data,
//       pollution: pollutionRes.data,
//     });
//   } catch (err) {
//     res.status(500).json({ error: "Weather fetch failed" });
//   }
// });

// app.get("/api/reverse-geocode", async (req, res) => {
//   const { lat, lon } = req.query;
//   try {
//     const response = await axios.get(
//       `http://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
//     );
//     res.json(response.data);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to fetch location" });
//   }
// });

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

cron.schedule("0 */12 * * *", async () => {
  console.log("Running 12-hour cron job for Indian states");

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
    server.listen(process.env.PORT || 8000, () => {
      console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
  });

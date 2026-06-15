// app.get("/api/download-csv", async (req, res) => {
//   try {
//     const data = await Weather.find().lean();

//     if (!data || data.length === 0) {
//       return res.status(404).json({ error: "No data found" });
//     }

//     // Nested object flatten readable format for CSV
//     const formattedData = data.map((item) => ({
//       "City Name": item.name || "",
//       Country: item.sys?.country || "",
//       Latitude: item.coord?.lat || "",
//       Longitude: item.coord?.lon || "",
//       "Weather Condition": item.weather?.[0]?.main || "",
//       "Weather Description": item.weather?.[0]?.description || "",
//       "Temperature (°C)": item.mainWeather?.temp || "",
//       "Feels Like (°C)": item.mainWeather?.feels_like || "",
//       "Min Temp (°C)": item.mainWeather?.temp_min || "",
//       "Max Temp (°C)": item.mainWeather?.temp_max || "",
//       "Pressure (hPa)": item.mainWeather?.pressure || "",
//       "Humidity (%)": item.mainWeather?.humidity || "",
//       "Wind Speed (m/s)": item.wind?.speed || "",
//       "Wind Direction (°)": item.wind?.deg || "",
//       "Visibility (m)": item.visibility || "",
//       "Cloud Coverage (%)": item.clouds?.all || "",
//       "Air Quality Index (AQI)": item.pollution?.aqi || "",
//       "CO (µg/m³)": item.pollution?.components?.co || "",
//       "NO (µg/m³)": item.pollution?.components?.no || "",
//       "NO₂ (µg/m³)": item.pollution?.components?.no2 || "",
//       "O₃ (µg/m³)": item.pollution?.components?.o3 || "",
//       "SO₂ (µg/m³)": item.pollution?.components?.so2 || "",
//       "PM2.5 (µg/m³)": item.pollution?.components?.pm2_5 || "",
//       "PM10 (µg/m³)": item.pollution?.components?.pm10 || "",
//       "NH₃ (µg/m³)": item.pollution?.components?.nh3 || "",
//       "Sunrise Time": item.sys?.sunrise || "",
//       "Sunset Time": item.sys?.sunset || "",
//       "Timezone Offset": item.timezone || "",
//       "Station Base": item.base || "",
//       "Weather Code": item.cod || "",
//       "City ID": item.cityId || "",
//       "Record Created At": new Date(item.createdAt).toLocaleString("en-IN", {
//         timeZone: "Asia/Kolkata",
//         day: "2-digit",
//         month: "2-digit",
//         year: "numeric",
//         hour: "2-digit",
//         minute: "2-digit",
//         second: "2-digit",
//         hour12: true,
//       }),
//     }));

//     // CSV fields
//     const fields = Object.keys(formattedData[0]);

//     const opts = {
//       fields,
//       quote: "",
//       delimiter: ",",
//       header: true,
//     };

//     const parser = new Parser(opts);
//     const csv = parser.parse(formattedData);

//     res.header("Content-Type", "text/csv");
//     res.attachment("weather_data.csv");
//     res.send(csv);
//   } catch (err) {
//     console.error("CSV generation error:", err);
//     res.status(500).json({ error: "Error generating CSV" });
//   }
// });

// app.get("/api/download-csv", async (req, res) => {
//   try {
//     const data = await Weather.find().lean();

//     if (!data || data.length === 0) {
//       return res.status(404).json({ error: "No data found" });
//     }

//     const formattedData = data.map((item) => ({
//       // 🌍 Location hierarchy (NEW)
//       Country: item.location?.country?.name || item.sys?.country || "",
//       "Country Code": item.location?.country?.code || "",
//       State: item.location?.state?.name || "",
//       City: item.location?.city?.name || item.name || "",

//       // 📍 Geo
//       Latitude: item.coord?.lat || "",
//       Longitude: item.coord?.lon || "",

//       // 🌦 Weather
//       "Weather Condition": item.weather?.[0]?.main || "",
//       "Weather Description": item.weather?.[0]?.description || "",
//       "Temperature (°C)": item.mainWeather?.temp || "",
//       "Feels Like (°C)": item.mainWeather?.feels_like || "",
//       "Min Temp (°C)": item.mainWeather?.temp_min || "",
//       "Max Temp (°C)": item.mainWeather?.temp_max || "",
//       "Pressure (hPa)": item.mainWeather?.pressure || "",
//       "Humidity (%)": item.mainWeather?.humidity || "",

//       // 🌬 Wind & Cloud
//       "Wind Speed (m/s)": item.wind?.speed || "",
//       "Wind Direction (°)": item.wind?.deg || "",
//       "Cloud Coverage (%)": item.clouds?.all || "",
//       Visibility: item.visibility || "",

//       // 🧪 Pollution
//       "AQI": item.pollution?.aqi || "",
//       "CO (µg/m³)": item.pollution?.components?.co || "",
//       "NO (µg/m³)": item.pollution?.components?.no || "",
//       "NO₂ (µg/m³)": item.pollution?.components?.no2 || "",
//       "O₃ (µg/m³)": item.pollution?.components?.o3 || "",
//       "SO₂ (µg/m³)": item.pollution?.components?.so2 || "",
//       "PM2.5 (µg/m³)": item.pollution?.components?.pm2_5 || "",
//       "PM10 (µg/m³)": item.pollution?.components?.pm10 || "",
//       "NH₃ (µg/m³)": item.pollution?.components?.nh3 || "",

//       // 🕒 Meta
//       "City ID": item.cityId || "",
//       "Weather Code": item.cod || "",
//       "Record Created At": new Date(item.createdAt).toLocaleString(
//         "en-IN",
//         {
//           timeZone: "Asia/Kolkata",
//           day: "2-digit",
//           month: "2-digit",
//           year: "numeric",
//           hour: "2-digit",
//           minute: "2-digit",
//           second: "2-digit",
//           hour12: true,
//         }
//       ),
//     }));

//     const fields = Object.keys(formattedData[0]);
//     const parser = new Parser({ fields });
//     const csv = parser.parse(formattedData);

//     res.header("Content-Type", "text/csv");
//     res.attachment("weather_data.csv");
//     res.send(csv);
//   } catch (err) {
//     console.error("CSV generation error:", err);
//     res.status(500).json({ error: "Error generating CSV" });
//   }
// });
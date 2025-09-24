import mongoose from "mongoose";

const WeatherSchema = new mongoose.Schema(
  {
    coord: {
      lon: Number,
      lat: Number,
    },
    weather: [
      {
        id: Number,
        main: String, // example: "Clouds"
        description: String,
        icon: String,
      },
    ],
    base: String,
    mainWeather: {
      // 👈 rename kora holo (eta holo temperature related data)
      temp: Number,
      feels_like: Number,
      temp_min: Number,
      temp_max: Number,
      pressure: Number,
      humidity: Number,
      sea_level: Number,
      grnd_level: Number,
    },
    visibility: Number,
    wind: {
      speed: Number,
      deg: Number,
    },
    clouds: {
      all: Number,
    },
    dt: Number,
    sys: {
      type: { type: Number },
      id: Number,
      country: String,
      sunrise: Number,
      sunset: Number,
    },
    timezone: Number,
    cityId: Number, // api theke "id"
    name: String, // city name
    cod: Number,

    // pollution data
    pollution: {
      aqi: Number, // 👈 direct aqi rakhlam, extra main object lagbe na
      components: {
        co: Number,
        no: Number,
        no2: Number,
        o3: Number,
        so2: Number,
        pm2_5: Number,
        pm10: Number,
        nh3: Number,
      },
      dt: Number,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Weather", WeatherSchema);

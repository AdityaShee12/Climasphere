import mongoose from "mongoose";

const WeatherSchema = new mongoose.Schema(
  {
    // 🌍 Location hierarchy
    location: {
      country: {
        code: String,     // IN, US
        name: String,     // India
      },
      state: {
        name: String,     // West Bengal, Delhi, Uttar Pradesh
        code: String,     // WB, DL, UP (optional)
      },
      city: {
        id: Number,       // OpenWeather city id
        name: String,
      },
    },

    coord: {
      lon: Number,
      lat: Number,
    },

    weather: [
      {
        id: Number,
        main: String,
        description: String,
        icon: String,
      },
    ],

    mainWeather: {
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

    sys: {
      country: String,
      sunrise: Number,
      sunset: Number,
    },

    timezone: Number,
    base: String,
    dt: Number,
    cod: Number,

    // 🌫 Pollution data
    pollution: {
      aqi: Number,
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
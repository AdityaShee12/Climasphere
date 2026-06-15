import mongoose from "mongoose";

const WeatherSchema = new mongoose.Schema(
  {
    location: {
      country: {
        code: {
          type: String,
          required: true,
          uppercase: true,
          trim: true,
        },
        name: {
          type: String,
          required: true,
          trim: true,
        },
      },

      state: {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        code: {
          type: String,
          uppercase: true,
          trim: true,
        },
      },

      city: {
        id: {
          type: Number,
          required: true,
          index: true,
        },
        name: {
          type: String,
          required: true,
          trim: true,
        },
      },
    },

    coord: {
      lat: {
        type: Number,
        required: true,
      },
      lon: {
        type: Number,
        required: true,
      },
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
      gust: Number,
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

    pollution: {
      aqi: {
        type: Number,
        min: 0,
        max: 500,
      },

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

    weatherTimestamp: {
      type: Date,
      required: true,
      index: true,
    },

    source: {
      type: String,
      default: "OpenWeather",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model("Weather", WeatherSchema);
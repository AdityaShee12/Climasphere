import Weather from "../models/weather.models.js"
import { Parser } from "json2csv";

const downloadCSV = async (req, res) => {
    try {
        const data = await Weather.find().lean();

        if (!data.length) {
            return res
                .status(404)
                .json({ error: "No data found" });
        }

        const formattedData = data.map((item) => ({
            // Location
            Country:
                item.location?.country?.name ?? "",

            CountryCode:
                item.location?.country?.code ?? "",

            State:
                item.location?.state?.name ?? "",

            StateCode:
                item.location?.state?.code ?? "",

            City:
                item.location?.city?.name ?? "",

            CityID:
                item.location?.city?.id ?? "",

            // Coordinates
            Latitude:
                item.coord?.lat ?? "",

            Longitude:
                item.coord?.lon ?? "",

            // Weather
            WeatherCondition:
                item.weather?.[0]?.main ?? "",

            WeatherDescription:
                item.weather?.[0]?.description ?? "",

            WeatherCode:
                item.weather?.[0]?.id ?? "",

            Temperature:
                item.mainWeather?.temp ?? "",

            FeelsLike:
                item.mainWeather?.feels_like ?? "",

            TempMin:
                item.mainWeather?.temp_min ?? "",

            TempMax:
                item.mainWeather?.temp_max ?? "",

            Pressure:
                item.mainWeather?.pressure ?? "",

            Humidity:
                item.mainWeather?.humidity ?? "",

            SeaLevel:
                item.mainWeather?.sea_level ?? "",

            GroundLevel:
                item.mainWeather?.grnd_level ?? "",

            // Wind
            WindSpeed:
                item.wind?.speed ?? "",

            WindDirection:
                item.wind?.deg ?? "",

            WindGust:
                item.wind?.gust ?? "",

            // Clouds
            CloudCoverage:
                item.clouds?.all ?? "",

            Visibility:
                item.visibility ?? "",

            // Pollution
            AQI:
                item.pollution?.aqi ?? "",

            CO:
                item.pollution?.components?.co ?? "",

            NO:
                item.pollution?.components?.no ?? "",

            NO2:
                item.pollution?.components?.no2 ?? "",

            O3:
                item.pollution?.components?.o3 ?? "",

            SO2:
                item.pollution?.components?.so2 ?? "",

            PM25:
                item.pollution?.components?.pm2_5 ?? "",

            PM10:
                item.pollution?.components?.pm10 ?? "",

            NH3:
                item.pollution?.components?.nh3 ?? "",

            CreatedAt:
                item.createdAt
                    ? new Date(
                        item.createdAt
                    ).toLocaleString("en-IN", {
                        timeZone: "Asia/Kolkata",
                    })
                    : "",

            UpdatedAt:
                item.updatedAt
                    ? new Date(
                        item.updatedAt
                    ).toLocaleString("en-IN", {
                        timeZone: "Asia/Kolkata",
                    })
                    : "",

            Source:
                item.source ?? "",
        }));

        const fields =
            Object.keys(formattedData[0]);

        const parser = new Parser({
            fields,
        });

        const csv =
            parser.parse(formattedData);

        res.header(
            "Content-Type",
            "text/csv"
        );

        res.attachment(
            `weather-data-${Date.now()}.csv`
        );

        return res.send(csv);
    } catch (error) {
        console.error(
            "CSV generation error:",
            error
        );

        return res.status(500).json({
            error:
                "Failed to generate CSV file",
        });
    }
};

export { downloadCSV };
import { Router } from "express";
import { weatherData, reverseGeocode, downloadCSV } from "../controllers/weatherData.controller.js"

const router = Router();

router.get("/reverse-geocode", reverseGeocode);
router.get("/weatherData/:cityName", weatherData);  
router.get("/download-csv", downloadCSV);

export default router;

import { downloadCSV } from "../controllers/downloadCSV.controller.js";
import { Router } from "express";

const router = Router();

router.get("/downloadCSV", downloadCSV);

export default router;
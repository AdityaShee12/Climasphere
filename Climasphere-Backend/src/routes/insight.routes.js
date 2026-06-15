import { Router } from "express";
import { createInsight, getAllInsights } from "../controllers/insight.controller.js";
import { upload } from "../middlewares/upload/multer.middleware.js";
const router = Router();

router
    .route("/uploadInsight")
    .post(upload.array("insights", 10), createInsight);
router.get("/getInsight", getAllInsights);

export default router;
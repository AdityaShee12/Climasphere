import { Router } from "express";
import {
  sendOtp,
  verifyOtp,
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  setPassword,
  searchUser,
  userList,
  friends,
} from "../controllers/user.controller.js";
import { createInsight, getAllInsights } from "../controllers/insight.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/otp").post(sendOtp);
router.route("/verify").post(verifyOtp);
router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

router
  .route("/insights/upload")
  .post(upload.array("insights", 10), createInsight);

router.get("/insights", getAllInsights);

router.route("/login").post( loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/passwordChange").post(setPassword);

router.route("/searchUser").get(searchUser);
router.route("/userList").get(verifyJWT, userList);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/friends").get(verifyJWT, friends);

export default router;

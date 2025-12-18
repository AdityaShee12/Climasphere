import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Insight } from "../models/insight.model.js";

export const createInsight = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const files = req.files || [];

  const insights = [];

  // Case 1: images uploaded
  if (files.length > 0) {
    for (let file of files) {
      const uploaded = await uploadOnCloudinary(file.path);

      insights.push({
        title: title || "",
        description: description || "",
        image: uploaded?.url || "", // ✅ STRING ONLY
      });
    }
  }
  // Case 2: text-only insight
  else {
    insights.push({
      title: title || "",
      description: description || "",
      image: "",
    });
  }

  const savedInsights = await Insight.insertMany(insights);

  return res
    .status(201)
    .json(
      new ApiResponse(201, savedInsights, "Insight(s) created successfully")
    );
});

export const getAllInsights = asyncHandler(async (req, res) => {
  const insights = await Insight.find().sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse(200, insights, "Insights fetched successfully")
  );
});
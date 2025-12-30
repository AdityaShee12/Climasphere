import mongoose from "mongoose";

const insightSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "",
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    image: {
      type: String, // ✅ ONLY STRING
      default: "",
    },
  },
  { timestamps: true }
);

export const Insight = mongoose.model("Insight", insightSchema);

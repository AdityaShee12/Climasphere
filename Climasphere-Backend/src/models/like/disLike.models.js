import mongoose, { Schema } from "mongoose";

const disLikeSchema = new Schema(
    {
        postId: {
            type: Schema.Types.ObjectId,
            ref: "Post",
            required: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        }
    },
    {
        timestamps: true,
    }
);

export const DisLike = mongoose.model("DisLike", disLikeSchema);
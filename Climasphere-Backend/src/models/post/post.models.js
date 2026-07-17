import mongoose, { Schema } from "mongoose";

const postSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        post: {
            pic: {
                type: String,
            },
            caption: {
                type: String,
            },
            viewsCount: {
                type: Number,
            },
            likesCount: {
                type: Number,
            },
            disLikesCount: {
                type: Number,
            },
            commentsCount: {
                type: Number,
            },
            sharesCount: {
                type: Number,
            },
            score: {
                type: String,
                default: 0
            }
        }
    },
    {
        timestamps: true,
    }
);

export const Post = mongoose.model("Post", postSchema);
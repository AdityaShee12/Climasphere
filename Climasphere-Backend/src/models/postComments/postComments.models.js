import mongoose, { Schema } from "mongoose";

const postCommentSchema = new Schema(
    {
        postId: {
            type: Schema.Types.ObjectId,
            ref: "Post",
            required: true,
            index: true,
        },

        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        comment: {
            type: String,
            required: true,
            trim: true,
        },

        // Reply 
        parentCommentId: {
            type: Schema.Types.ObjectId,
            ref: "PostComment",
            default: null,
        },

        likesCount: {
            type: Number,
            default: 0,
        },

        repliesCount: {
            type: Number,
            default: 0,
        },

        isEdited: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

export const PostComment = mongoose.model(
    "PostComment",
    postCommentSchema
);
import calculateScore from "../utils/calculateScore.js";
import { Post } from "../models/post.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const likePost = asyncHandler(async (req, res) => {

    const { postId, photoId, userId } = req.body;

    const document = await Post.findById(postId);

    if (!document) {
        throw new ApiError(404, "Post not found");
    }

    const post = document.post.find(
        item => item.photoId === photoId
    );

    if (!post) {
        throw new ApiError(404, "Photo not found");
    }

    // আগে Like করেছে কিনা
    const alreadyLiked = post.likedUsers.some(
        id => id.toString() === userId
    );

    if (alreadyLiked) {
        throw new ApiError(400, "You already liked this post");
    }

    // Like Add
    post.likedUsers.push(userId);

    // Like Count Increase
    post.likes++;

    // Ranking Score Update
    post.score = calculateScore(post);

    await document.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            post,
            "Post liked successfully"
        )
    );
});

const unlikePost = asyncHandler(async (req, res) => {

    const { postId, photoId, userId } = req.body;

    if (!postId || !photoId || !userId) {
        throw new ApiError(400, "All fields are required");
    }

    const document = await Post.findById(postId);

    if (!document) {
        throw new ApiError(404, "Post not found");
    }

    const post = document.post.find(
        item => item.photoId === photoId
    );

    if (!post) {
        throw new ApiError(404, "Photo not found");
    }

    // User আগে Like করেছে কিনা
    const likedIndex = post.likedUsers.findIndex(
        id => id.toString() === userId
    );

    if (likedIndex === -1) {
        throw new ApiError(400, "You have not liked this post");
    }

    // likedUsers থেকে Remove
    post.likedUsers.splice(likedIndex, 1);

    // Like Count কমাও
    if (post.likes > 0) {
        post.likes--;
    }

    // Score Update
    post.score = calculateScore(post);

    // Save
    await document.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            post,
            "Post unliked successfully"
        )
    );
});

export { likePost, unlikePost };
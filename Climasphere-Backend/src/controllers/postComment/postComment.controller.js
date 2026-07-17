import calculateScore from "../utils/calculateScore.js";
import { Post } from "../models/post.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const commentPost = asyncHandler(async (req, res) => {

    const {
        postId,
        photoId,
        userId,
        fullName,
        avatar,
        comment
    } = req.body;

    if (
        !postId ||
        !photoId ||
        !userId ||
        !fullName ||
        !comment
    ) {
        throw new ApiError(400, "All required fields are required");
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

    // Add Comment

    post.commentList.push({
        userId,
        fullName,
        avatar,
        comment
    });

    // Increase Comment Count

    post.comments++;

    // Update Ranking Score

    post.score = calculateScore(post);

    await document.save();

    return res.status(201).json(
        new ApiResponse(
            201,
            post,
            "Comment added successfully"
        )
    );

});

export { commentPost };
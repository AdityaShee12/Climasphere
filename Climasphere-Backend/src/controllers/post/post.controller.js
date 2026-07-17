import { Post } from "../../models/post/post.models.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/response/ApiResponse.js";
import { uploadOnCloudinary } from "../../utils/storage/cloudinary.js";

const createPost = asyncHandler(async (req, res) => {
    const { userId, trimmed } = req.body;
    if (
        !userId ||
        !trimmed ||
        [trimmed].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required");
    }

    const userPost = await Post.findOne({ userId });

    const postLocalPath = req.files?.imagePreview?.[0]?.path;

    if (!postLocalPath) {
        throw new ApiError(400, "Post image is required");
    }

    const postUrl = await uploadOnCloudinary(postLocalPath);

    let PostData;

    if (userPost) {
        userPost.post.push({
            pic: postLocalPath,
            caption: trimmed,
        });
        PostData = await userPost.save();
    } else {
        PostData = await Post.create({
            userId: userId,
            post:
            {
                pic: postUrl?.url,
                caption: trimmed,
                viewsCount: 0,
                likesCount: 0,
                disLikesCount: 0,
                commentsCount: 0,
                sharesCount: 0,
                score: 0,
            },
        });
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            PostData,
            "Post Successfully Uploaded"
        )
    );
});

const getPost = asyncHandler(async (req, res) => {
    const posts = await Post.find({})
        .populate(
            "userId",
            "fullName avatar"
        )
        .sort({
            "post.score": -1,
            createdAt: -1
        });

    return res.status(200).json(
        new ApiResponse(
            200,
            posts,
            "Feed fetched successfully"
        )
    );
});

const addView = asyncHandler(async (req, res) => {

    const { postId, photoId, userId } = req.body;

    const document = await Post.findById(postId);

    if (!document) {
        throw new ApiError(404, "Post not found");
    }

    const post = document.post.find(
        p => p.photoId === photoId
    );

    if (!post) {
        throw new ApiError(404, "Photo not found");
    }

    const alreadyViewed = post.viewedUsers.some(
        id => id.toString() === userId
    );

    if (alreadyViewed) {

        return res.status(200).json(
            new ApiResponse(
                200,
                {},
                "Already counted"
            )
        );

    }

    post.viewedUsers.push(userId);

    post.views++;

    post.score =
        (post.likes * 5) +
        (post.comments * 10) +
        (post.shares * 20) +
        (post.views * 0.2);

    await document.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            post,
            "View Added"
        )
    );

});

export { createPost, getPost, addView };
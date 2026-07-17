import { Router } from "express";
import { upload } from "../middlewares/upload/multer.middleware.js";
import { createPost, getPost, addView } from "../controllers/post/post.controller.js";

const router = Router();

router.route("/createPost").post(
    upload.fields([
        {
            name: "imagePreview",
            maxCount: 1,
        },
    ]),
    createPost
);

router.post("/getPost", getPost);

// router.post("/addView", addView);

// router.post("/like", likePost);

// router.post("/unlike", unlikePost);

// router.post("/comment", commentPost);

// router.route("/my-posts").get(verifyJWT, getOwnAllPosts)

// router.route("/my-posts/:postId").get(verifyJWT, getSinglePost)

// router.get("/user/:userId", verifyJWT, getClickedUserPosts);

// // ✅ Get single post by ID
// router.get("/:postId", getSinglePost);

// // ✅ Update post (only owner, image optional)
// router.patch("/:postId", verifyJWT, updatePost);

// // ✅ Delete post (only owner)
// router.delete("/:postId", verifyJWT, deletePost);

// // ✅ Like toggle on a post
// router.route("/:postId/like").post(verifyJWT, togglePostLike)

// // ✅ Dislike toggle on a post
// router.post("/:postId/dislike", verifyJWT, togglePostDislike);

// // ✅ Add view to post
// router.post("/:postId/view", addPostViews);

export default router;
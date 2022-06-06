const express = require("express");
const router = express.Router();
const PostsController = require("../controller/posts");
const handleErrorAsync = require("../service/handleErrorAsync");
const auth = require("../middleware/auth");

router.get("/", auth.isAuth, PostsController.getPostsbyContent);
router.get("/:id", PostsController.getPosts);
router.post("/", auth.isAuth, PostsController.createPosts);
router.patch("/:id", PostsController.updatePosts);
router.delete("/:id", PostsController.deletePosts);

module.exports = router;

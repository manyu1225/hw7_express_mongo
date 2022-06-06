const express = require("express");
const router = express.Router();
const PostsController = require("../controller/posts");
const handleErrorAsync = require("../service/handleErrorAsync");
const auth = require("../middleware/auth");

router.get("/posts", auth.isAuth, PostsController.getPostsbyContent);
router.get("/post/:id", PostsController.getPosts);
router.post("/posts", auth.isAuth, PostsController.createPosts);
router.patch("/post/:id", PostsController.updPosts);
router.delete("/post/:id", PostsController.delPosts);

module.exports = router;

const express = require("express");
const authCheck = require("../middleware/check-auth");
const multerCheck = require("../middleware/file-check");
const postController = require("../controller/postController");
const router = express.Router();

// Save post
router.post("", authCheck, multerCheck, postController.createPost);

// Retrieve all posts
router.get("", postController.getPosts);

// Delete a post
router.delete("/:id", authCheck, postController.deletePost);

// Update a post
router.put("", authCheck, multerCheck, postController.updatePost);

// Retrieve a post
router.get("/:id", postController.getPost);

module.exports = router;

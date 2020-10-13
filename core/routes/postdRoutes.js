const express = require("express");
const multer = require("multer");
const authCheck = require("../middleware/check-auth");
const postController = require("../controller/postController");
const router = express.Router();

var MIME_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
};

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_MAP[file.mimetype];
    let error = new Error("Invaild Mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "images");
  },
  filename: (req, file, cb) => {
    var ext = MIME_MAP[file.mimetype];
    var name = file.originalname.toLowerCase().split(" ").join("-");
    cb(null, name + "-" + Date.now() + "." + ext);
  },
});

// Save post
router.post("", authCheck,
  multer({ storage: storage }).single("image"),
  postController.createPost
);

// Retrieve all posts
router.get("", postController.getPosts);

// Delete a post
router.delete("/:id", authCheck, postController.deletePost);

// Update a post
router.put("", authCheck,
  multer({ storage: storage }).single("image"),
  postController.updatePost
);

// Retrieve a post
router.get("/:id", postController.getPost);

module.exports = router;

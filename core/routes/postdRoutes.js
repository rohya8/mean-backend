const express = require("express");
const Post = require("../models/post");
const router = express.Router();
const multer = require("multer");
const authCheck = require("../middleware/check-auth");

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
router.post(
  "",
  authCheck,
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: url + "/images/" + req.file.filename,
    });
    post
      .save()
      .then((result) => {
        res.status(201).json({
          message: "Post added successfully",
          post: {
            ...result,
            id: result._id,
          },
        });
      })
      .catch((err) => {
        res.status(400).json({ message: "Post not added", postId: null });
      });
  }
);

// Retrieve all posts
router.get("", (req, res, next) => {
  const pageSize = +req.query.pageSize;
  const page = +req.query.page;
  const postQuery = Post.find({});
  let retrievePost;
  if (pageSize && page) {
    postQuery.skip(pageSize * (page - 1)).limit(pageSize);
  }
  //TODO: change to aggrregate later
  postQuery
    .then((result) => {
      retrievePost = result;
      return Post.estimatedDocumentCount();
    }).then((count) => {
      res.status(200).json({
        message: "Success",
        posts: retrievePost,
        maxPost: count
      });
    })
    .catch((err) => {
      res.status(400).json({
        message: "Something went Wrong",
        posts: [],
      });
    });
});

// Delete a post
router.delete("/:id",authCheck, (req, res, next) => {
  Post.deleteOne({ _id: req.params.id })
    .then(() => {
      res.status(200).json({
        message: "Post delete successfully",
      });
    })
    .catch(() => {
      res.status(400).json({
        message: "Post not deleted.",
      });
    });
});

// Update a post
router.put("",authCheck, multer({ storage: storage }).single("image"), (req, res) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }
  Post.updateOne(
    { _id: req.body.id },
    {
      $set: {
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath,
      },
    }
  )
    .then((result) => {
      res.status(200).json({
        message: "Post update successfully.",
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(400).json({
        message: "Post not updated.",
      });
    });
});

// Retrieve a post
router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id)
    .then((result) => {
      if (result) {
        res.status(200).json(result);
      } else {
        res.status(404).json({ message: "Post not found." });
      }
    })
    .catch((err) => {
      res.status(400).json({
        message: "Something went Wrong",
        posts: [],
      });
    });
});

module.exports = router;

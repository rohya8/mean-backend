const express = require("express");
const Post = require("../models/post");
const router = express.Router();
const multer = require("multer");

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

router.post(
  "",
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: url,
    });
    post
      .save()
      .then((result) => {
        res
          .status(201)
          .json({
            message: "Post added successfully",
            post: {
              id: result._id,
              title: result.title,
              content: result.content,
              imagePath: result.imagePath
              // ...result
            },
          });
      })
      .catch((err) => {
        res.status(400).json({ message: "Post not added", postId: null });
      });
  }
);

router.get("", (req, res, next) => {
  Post.find({})
    .then((result) => {
      res.status(200).json({
        message: "Success",
        posts: result,
      });
    })
    .catch((err) => {
      res.status(400).json({
        message: "Something went Wrong",
        posts: [],
      });
    });
});

router.delete("/:id", (req, res, next) => {
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

router.put("", (req, res) => {
  Post.updateOne(
    { _id: req.body.id },
    {
      $set: {
        title: req.body.title,
        content: req.body.content,
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

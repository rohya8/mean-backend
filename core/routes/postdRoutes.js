const express = require("express");
const Post = require("../models/post");
const router = express.Router();
const multer = require("multer");
const authCheck = require("../middleware/check-auth");
const CONSTANT = require('../CONSTANT.json');

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
      creator: req.userData.userId
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
        res.status(500).json({ message: CONSTANT.post_create_err_message });
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
    .catch(err => {
      res.status(500).json({
        message: CONSTANT.post_retrieve_err_message

      });
    });
});

// Delete a post
router.delete("/:id", authCheck, (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then(result => {
      if (result.deletedCount > 0) {
        res.status(200).json({
          message: "Post delete successfully",
        });
      } else {
        res.status(401).json({ message: "Unauthorized action" });
      }

    })
    .catch(() => {
      res.status(500).json({
        message: CONSTANT.post_delete_err_message,
      });
    });
});

// Update a post
router.put("", authCheck, multer({ storage: storage }).single("image"), (req, res) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }
  Post.updateOne(
    { _id: req.body.id, creator: req.userData.userId },
    {
      $set: {
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath,
        creator: req.userData.userId
      },
    }
  )
    .then((result) => {
      if (result.nModified > 0) {
        res.status(200).json({
          message: "Post update successfully.",
        });
      } else {
        res.status(401).json({ message: "Unauthorized action" });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({
        message: CONSTANT.post_update_err_message,
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
    .catch(err => {
      res.status(500).json({
        message: CONSTANT.post_retrieve_err_message
      });
    });
});

module.exports = router;

process
  .on('unhandledRejection', (reason, p) => {
    console.error(reason, 'Unhandled Rejection at ', p);
  })
  .on('uncaughtException', err => {
    console.error('Uncaught Exception thrown', err);
  });
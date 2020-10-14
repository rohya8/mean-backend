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

module.exports = multer({ storage: storage }).single("image");
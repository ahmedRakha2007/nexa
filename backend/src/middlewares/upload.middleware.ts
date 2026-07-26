import multer from "multer";
import createError from "http-errors";

const storage = multer.memoryStorage();

const upload = multer({
  storage,

  // Maximum image size: 5 MB
  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter(req, file, cb) {
    const allowedMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(
        createError(400, "Only JPEG, PNG, and WEBP images are allowed.")
      );
    }

    cb(null, true);
  },
});

export default upload;
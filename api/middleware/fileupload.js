const multer = require("multer");
const fs = require("fs");

function imageUpload() {
  // Create the uploads directory if it doesn't exist
  const uploadDirectory = "./uploads";
  if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory);
  }

  // Define a function to filter file types
  const fileFilter = (req, file, cb) => {
    // Allowed file types
    const allowedFileTypes = ["image/jpeg", "image/png", "image/gif"];

    if (allowedFileTypes.includes(file.mimetype)) {
      // Accept the file
      cb(null, true);
    } else {
      // Reject the file
      cb(
        new Error(
          "Invalid file type. Only JPEG, PNG, and GIF files are allowed."
        )
      );
    }
  };

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./uploads");
    },
    filename: function (req, file, cb) {
      cb(null, new Date().toISOString() + file.originalname);
    },
  });
  const image = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
      fileSize: 1024 * 1024 * 5,
    },
  });
}

module.exports = imageUpload

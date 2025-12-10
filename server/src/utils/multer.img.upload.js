const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },

  filename: function (req, file, cb) {
    const randomtext = Date.now() + "-" + Math.round(Math.random() * 1e9);
    let fileextension = file.originalname.split(".").pop();
    cb(null, file.fieldname + "-" + randomtext + "." + fileextension);
  },
});

function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif|avif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images only! (jpeg, jpg, png, gif, avif)");
  }
}

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});





module.exports = upload;
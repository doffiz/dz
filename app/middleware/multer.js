const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); // Define the destination folder for uploaded images
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const fileExtension = getFileExtension(file.originalname); // Get the file extension
      cb(null, file.fieldname + '-' + uniqueSuffix + '.' + fileExtension);
    },
  });
  
  function getFileExtension(filename) {
    // Extract the file extension from the original filename
    const parts = filename.split('.');
    return parts[parts.length - 1];
  }
  
  const upload = multer({ storage: storage });
  
  module.exports = upload;
  
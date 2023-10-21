const authJwt = require("./authJwt");
const verifySignUp = require("./verifySignUp");
const bodyParser = require("./bodyParser");
const upload = require("./multer");

module.exports = {
  authJwt,
  verifySignUp,
  bodyParser,
  upload
};
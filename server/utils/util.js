const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

function hashPassword(password) {
  return bcrypt.hashSync(password, 10);
}
const options = {
  expiresIn: "6h",
};
function generateAccessToken(user) {
  const payload = {
    userId: user._id,
    name: user.name,
    email: user.email,
  };
  return jwt.sign(payload, process.env.HIDDEN_SECRET, options);
}
function checkValidPassword(password, hashedPassword) {
  return bcrypt.compareSync(password, hashedPassword);
}
module.exports = {
  generateAccessToken,
  hashPassword,
  checkValidPassword,
};

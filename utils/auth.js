const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const secret = process.env.JWT_SECRET;
const refreshSecret = process.env.JWT_REFRESH_SECRET;

const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email, role: user.role }, secret, { expiresIn: '1h' });
};

const refreshToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email, role: user.role }, refreshSecret, { expiresIn: '10h' });
};

const verifyToken = (token) => {
  return jwt.verify(token, secret);
};

const hashPassword = async (password) => {
  return await bcrypt.hash(password, saltRounds);
};

const comparePassword = async (password, hash) => {
  // console.log("compare work :", hash);
  return await bcrypt.compare(password, hash);
};

module.exports = {
  generateToken,
  verifyToken,
  hashPassword,
  comparePassword,
  refreshToken
};

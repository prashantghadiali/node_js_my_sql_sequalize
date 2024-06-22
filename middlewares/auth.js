const jwt = require('jsonwebtoken');
const { TokenBlacklist } = require('../models');
const { AccessTokenErrorResponse } = require('../utils/apiResponse');
const secret = process.env.JWT_SECRET;

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return new AccessTokenErrorResponse('Access token missing').send(res);
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify token
    const decoded = jwt.verify(token, secret);
    req.user = decoded;

    // Check if token is blacklisted
    const blacklistedToken = await TokenBlacklist.findOne({ where: { token } });
    if (blacklistedToken) {
      return new AccessTokenErrorResponse('Access token revoked').send(res);
    }

    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    return new AccessTokenErrorResponse('Invalid access token').send(res);
  }
};

module.exports = authenticateToken;
const jwt = require("jsonwebtoken");

const { JWT_SECRET } = require("../utils/constants");
const AuthorizationError = require("../errors/authorizationError");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(new AuthorizationError("Необходима авторизация"));
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return next(new AuthorizationError("Необходима авторизация"));
  }

  req.user = payload;

  return next();
};

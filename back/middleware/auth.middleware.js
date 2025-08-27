const { validateToken } = require("../utils/jwt.util");
module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ message: "No token provided" });
  }
  const token = authorization.split(" ")[1];
  try {
    const decoded = validateToken(token);
    if (!decoded) {
      return res.status(401).json({ message: "Invalid token" });
    }
    req.user = decoded;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

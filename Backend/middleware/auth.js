const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // { id, role }
      next();
    } catch (err) {
      const authError = new Error("Not authorized, token invalid");
      authError.statusCode = 401;
      throw authError;
    }
  } else {
    const noTokenError = new Error("Not authorized, no token");
    noTokenError.statusCode = 401;
    throw noTokenError;
  }
};

// Optional: restrict routes to Admin only
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "Admin") {
    next();
  } else {
    const forbiddenError = new Error("Admin access only");
    forbiddenError.statusCode = 403;
    throw forbiddenError;
  }
};

module.exports = { protect, adminOnly };
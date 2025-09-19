import jwt from 'jsonwebtoken';

export const validateAccess = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
      return res
        .status(401)
        .json({ success: false, message: "You are not logged in" });
    }

    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res
        .status(401)
        .json({ success: false, message: "Invalid authorization format" });
    }

    const token = parts[1];

    jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, decoded) => {
      if (err) {
        return res
          .status(403)
          .json({ success: false, message: "Invalid or expired token" });
      }

      req.user_id = decoded._id; 
      next(); 
    });
  } catch (error) {
    console.error(`Error in validateAccess : ${error}`);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

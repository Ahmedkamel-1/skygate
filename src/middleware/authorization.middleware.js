import jwt from "jsonwebtoken";
import { User } from "../../DB/models/user.model.js";

export const auth = (allowedRoles = []) => {
  return async (req, res, next) => {
    try {
      // Get Token
      const token = req.headers.authorization?.split(process.env.JWT_SECRET)[1];
      if (!token)
        return res.status(401).json({ success: false, message: "No token provided" });
      console.log("Toooooooooken")
      // Verify
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get User
      const user = await User.findById(decoded.id);
      if (!user)
        return res.status(404).json({ success: false, message: "User not found" });

      req.user = user; // attach user to request

      // Authorization
      if (allowedRoles.length && !allowedRoles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          message: "You are not allowed to access this resource"
        });
      }

      next();
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token"
      });
    }
  };
};

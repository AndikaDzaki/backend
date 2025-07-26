import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "rahasia_token";

export const verifyToken = (req, res, next) => {

  const token = req.cookies?.admin_token || req.cookies?.guru_token;

  if (!token) {
    return res.status(401).json({ message: "Token tidak ditemukan di cookie" });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
       
        res.clearCookie("admin_token");
        res.clearCookie("guru_token");
        return res.status(401).json({ message: "Token telah kedaluwarsa" });
      }
      return res.status(403).json({ message: "Token tidak valid" });
    }

   
    req.user = decoded;
    next();
  });
};

import jwt from "jsonwebtoken";

export const verifyGuru = (req, res, next) => {
  const token = req.cookies.guru_token;
  const JWT_SECRET = process.env.JWT_SECRET;

  if (!JWT_SECRET) {
    console.error(" JWT_SECRET belum diset");
    return res.status(500).json({ message: "Server error: JWT_SECRET tidak ditemukan" });
  }

  if (!token) {
    return res.status(401).json({ message: "Token tidak ditemukan di cookie" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.error(" Token error:", err.message);
      return res.status(403).json({ message: "Token tidak valid" });
    }

    if (user.role !== "user") {
      return res.status(403).json({ message: "Akses hanya untuk guru" });
    }

    req.user = user;
    next();
  });
};

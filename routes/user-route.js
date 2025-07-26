import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { getMe } from "../controller/auth-controller.js";

const router = express.Router();


router.get("/admin/me", verifyToken, (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Akses ditolak. Bukan admin." });
  }
  return getMe(req, res);
});


router.get("/guru/me", verifyToken, (req, res) => {
  return getMe(req, res);
});

export default router;

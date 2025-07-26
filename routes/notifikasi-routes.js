import express from "express";
import { getNotifikasiUser, tandaiNotifikasi, hapusNotifikasi, generateNotifikasi } from "../controller/notifikasiUser.js";
import { verifyGuru } from "../middleware/verifyGuru.js"; 

const router = express.Router();

router.get("/notifikasi-user/:id", verifyGuru, getNotifikasiUser);
router.post("/notifikasi-user/:id/dibaca", tandaiNotifikasi);
router.delete("/notifikasi-user/:id", hapusNotifikasi);

router.get("/notifikasi-user/generate", generateNotifikasi)

export default router;

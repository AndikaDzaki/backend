import express from "express"
import { getNotifikasiAdmin, markAsRead, deleteNotifikasi } from "../controller/notifikasiAdmin.js";


const router = express.Router();

router.get("/notifikasi", getNotifikasiAdmin);
router.put("/notifikasi/:id", markAsRead);
router.delete("/notifikasi/:id", deleteNotifikasi);




export default router;
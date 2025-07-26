import express from "express"
import { createJadwal, deleteJadwal, getAllJadwal, getJadwalGuru, updateJadwal, generateJadwalOtomatis } from "../controller/jadwal.js";
import { verifyGuru } from "../middleware/verifyGuru.js";


const route = express.Router();

route.get("/jadwal", getAllJadwal)
route.post("/jadwal", createJadwal)
route.put("/jadwal/:id", updateJadwal)
route.delete("/jadwal/:id", deleteJadwal)
route.get("/jadwal/generate-harian", generateJadwalOtomatis);
route.get("/hari-ini", verifyGuru, getJadwalGuru)


export default route
import express from "express";
import { createSiswa, deleteSiswa, getAllSiswa, updateSiswa } from "../controller/siswa.js";

const route = express.Router();

route.get("/siswa", getAllSiswa);
route.post("/siswa", createSiswa);
route.put("/siswa/:id", updateSiswa);
route.delete("/siswa/:id", deleteSiswa)

export default route;

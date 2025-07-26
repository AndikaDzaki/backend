import express from "express"
import { createTahunAjaran, deleteTahunAjaran, getAllTahunAjaran, updateTahunAjaran } from "../controller/tahun-ajaran.js";

const route = express.Router();

route.get("/tahunajaran", getAllTahunAjaran)
route.post("/tahunajaran", createTahunAjaran)
route.put("/tahunajaran/:id", updateTahunAjaran)
route.delete("/tahunajaran/:id", deleteTahunAjaran)

export default route
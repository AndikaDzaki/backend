import express from "express";
import { createKelas, deleteKelas, getAllKelas, updateKelas, getKelasByGuru } from "../controller/kelas.js";



const route = express.Router();

route.get("/kelas", getAllKelas);
route.post("/kelas", createKelas);
route.put("/kelas/:id", updateKelas);
route.delete("/kelas/:id", deleteKelas);
route.get("/kelas-by-guru", getKelasByGuru);

export default route;

import express from "express"
import { addGuru, deleteGuru, getAllGuru, updateGuru, getGuruProfile } from "../controller/guru.js"
import { verifyGuru } from "../middleware/verifyGuru.js"

const route = express.Router()

route.get("/guru", getAllGuru)
route.post("/guru", addGuru)
route.put("/guru/:id", updateGuru)
route.delete("/guru/:id", deleteGuru)
route.get("/guru-profile", verifyGuru, getGuruProfile);



export default route
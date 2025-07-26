import express from "express";
import {
  getAllSemester,
  createSemester,
  updateSemester,
  deleteSemester,
} from "../controller/semester.js";

const route = express.Router();

route.get("/semester", getAllSemester);
route.post("/semester", createSemester);
route.put("/semester/:id", updateSemester);
route.delete("/semester/:id", deleteSemester);

export default route;

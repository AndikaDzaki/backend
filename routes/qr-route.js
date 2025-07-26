import express from "express";
import { getQrToken } from "../controller/qr-code.js";

const route = express.Router();

route.get("/qr-token/:id", getQrToken);

export default route;

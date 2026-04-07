import express from "express";
import { chat } from "../Controller/ChatController.js";

const router = express.Router();

router.post("/", chat);

export default router;
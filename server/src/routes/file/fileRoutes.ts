import express from "express";
import upload from "../../config/upload";
import { getFiles, uploadFile, removeFile } from "../../controllers/fileController";

const router = express.Router();

router.get("/", getFiles);
router.post("/upload", upload.single("file"), uploadFile);
router.delete("/remove/:id", removeFile);

export default router;

import express, { Router } from "express";
import multer from "multer";
import path from "path";
import { uploadFileToDiscord } from "./bot";
import axios from "axios";
import fs from "fs";

export const createDiscordUploadAPI = (): Router => {
  const router = Router();
  const upload = multer({ dest: "uploads/" });

  // Ensure the 'downloads' directory exists
  const ensureDownloadDirExists = () => {
    const downloadDir = path.join(process.cwd(), "downloads");
    if (!fs.existsSync(downloadDir)) {
      fs.mkdirSync(downloadDir, { recursive: true });
    }
  };

  // Upload endpoint
  router.post("/upload", upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        res.status(400).send("No file uploaded.");
        return;
      }

      const filePath = path.join(process.cwd(), req.file.path);
      const fileLink = await uploadFileToDiscord(
        filePath,
        req.file.originalname
      );

      res.json({ fileLink });
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).send("Failed to upload file.");
    }
  });

  // Download endpoint
  router.post("/download", async (req, res) => {
    try {
      const { fileUrl } = req.body;
      if (!fileUrl) {
        res.status(400).send("File URL is required.");
        return;
      }

      ensureDownloadDirExists();
      const fileName = fileUrl.split("/").pop() || "downloaded_file";

      const response = await axios({
        method: "GET",
        url: fileUrl,
        responseType: "stream",
      });

      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${fileName}"`
      );
      res.setHeader("Content-Type", response.headers["content-type"]);

      response.data.pipe(res);

      response.data.on("end", () => {
        console.log(`Downloaded ${fileName} successfully.`);
      });

      response.data.on("error", (err: any) => {
        console.error("Error downloading file:", err);
        res.status(500).send("Failed to download file.");
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("An error occurred while downloading the file.");
    }
  });

  return router;
};

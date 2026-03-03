const express = require("express");
const multer = require("multer");
const { google } = require("googleapis");
const fs = require("fs");

const app = express();
const upload = multer({ dest: "uploads/" });

// AUTH dari Environment Variable Render
const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.SERVICE_ACCOUNT),
  scopes: ["https://www.googleapis.com/auth/drive"],
});

const drive = google.drive({ version: "v3", auth });

// GANTI dengan ID folder Drive kamu
const FOLDER_ID = "1QVdZQ-0pU0YRKcXvcFecaNNwbsAWvaaf";

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const fileMetadata = {
      name: req.file.originalname,
      parents: [FOLDER_ID],
    };

    const media = {
      mimeType: req.file.mimetype,
      body: fs.createReadStream(req.file.path),
    };

    await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: "id",
    });

    fs.unlinkSync(req.file.path);

    res.send("Upload berhasil");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error upload");
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server jalan");
});

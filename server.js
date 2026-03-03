const express = require("express");
const multer = require("multer");
const { google } = require("googleapis");
const fs = require("fs");

const app = express();
const upload = multer({ dest: "uploads/" });

const auth = new google.auth.GoogleAuth({
  keyFile: "service-account.json",
  scopes: ["https://www.googleapis.com/auth/drive"],
});

const drive = google.drive({ version: "v3", auth });

app.post("/upload", upload.single("file"), async (req, res) => {
  const fileMetadata = {
    name: req.file.originalname,
    parents: ["1QVdZQ-0pU0YRKcXvcFecaNNwbsAWvaaf"],
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

  res.send("Upload berhasil");
});

app.listen(3000, () => console.log("Server jalan di port 3000"));
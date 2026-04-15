const express = require("express");
const multer = require("multer");
const exifParser = require("exif-parser");
const fs = require("fs");

const app = express();
const upload = multer({ dest: "uploads/" });

app.post("/exif", upload.single("file"), (req, res) => {

  try {
    const buffer = fs.readFileSync(req.file.path);

    const parser = exifParser.create(buffer);
    const result = parser.parse();

    let gps = { lat: "", lng: "" };

    if (result.tags) {
      gps.lat = result.tags.GPSLatitude || "";
      gps.lng = result.tags.GPSLongitude || "";
    }

    fs.unlinkSync(req.file.path);

    res.json(gps);

  } catch (e) {
    res.json({ lat: "", lng: "" });
  }
});

app.listen(3000, () => console.log("EXIF API running"));

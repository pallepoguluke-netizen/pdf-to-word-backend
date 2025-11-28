const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(cors());

const upload = multer({ dest: "uploads/" });

app.post("/convert", upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).send("No file uploaded");
    }

    const pdfPath = req.file.path;
    const outputDocx = pdfPath + ".docx";

    const command = `soffice --headless --convert-to docx --outdir uploads ${pdfPath}`;

    exec(command, (error) => {
        if (error) {
            console.error("Conversion error:", error);
            return res.status(500).json({ success: false, message: "Conversion failed" });
        }

        fs.readFile(outputDocx, (err, buffer) => {
            if (err) {
                console.error("File read error:", err);
                return res.status(500).json({ success: false, message: "Cannot read converted file" });
            }

            res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
            res.setHeader("Content-Disposition", "attachment; filename=converted.docx");
            res.send(buffer);

            fs.unlink(pdfPath, () => {});
            fs.unlink(outputDocx, () => {});
        });
    });
});

app.get("/", (req, res) => {
    res.send("PDF to Word Backend Running Successfully!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Server running on port", PORT);
});

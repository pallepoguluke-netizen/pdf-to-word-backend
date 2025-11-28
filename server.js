const express = require("express");
const multer = require("multer");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

const app = express();
const upload = multer({ dest: "uploads/" });

app.post("/convert", upload.single("pdf"), (req, res) => {
    const pdfPath = req.file.path;
    const outputDocx = pdfPath + ".docx";

    // LibreOffice command to convert PDF → DOCX
    const command = `libreoffice --headless --convert-to docx --outdir uploads ${pdfPath}`;

    exec(command, (error) => {
        if (error) {
            console.error("Conversion Error:", error);
            return res.status(500).json({ success: false, message: "Conversion failed" });
        }

        // Read the converted DOCX file
        fs.readFile(outputDocx, (err, fileBuffer) => {
            if (err) {
                console.error("File Read Error:", err);
                return res.status(500).json({ success: false, message: "Cannot read output file" });
            }

            // Send DOCX file to client
            res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
            res.setHeader("Content-Disposition", "attachment; filename=converted.docx");
            res.send(fileBuffer);

            // Cleanup
            fs.unlink(pdfPath, () => {});
            fs.unlink(outputDocx, () => {});
        });
    });
});

// Default route
app.get("/", (req, res) => {
    res.send("PDF to Word Backend Running Successfully!");
});

app.listen(10000, () => {
    console.log("Server running on port 10000");
});

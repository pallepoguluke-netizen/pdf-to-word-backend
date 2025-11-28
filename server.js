const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(fileUpload());

app.get("/", (req, res) => {
    res.send("PDF to Word Backend Running ✔️");
});

app.post("/convert", (req, res) => {
    if (!req.files || !req.files.pdf) {
        return res.status(400).send("No PDF file uploaded");
    }

    // Fake response (real conversion will be added later)
    res.json({
        success: true,
        message: "PDF received! (Conversion logic will be added soon)"
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

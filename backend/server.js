const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { PythonShell } = require("python-shell");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.post("/process-image", async (req, res) => {
    console.log("Received request:", req.body);
  
    if (!req.body || typeof req.body !== "object") {
      return res.status(400).json({ error: "Invalid request format. Expected JSON." });
    }
  
    try {
      const imageData = req.body.image; // Extract raw base64 string
      if (!imageData) {
        return res.status(400).json({ error: "Missing image data in request." });
      }
  
      // Ensure temp directory exists
      const tempDir = path.join(__dirname, "temp");
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
      }
  
      // Write the raw base64 string to file
      const inputPath = path.join(tempDir, "input.txt");
      fs.writeFileSync(inputPath, imageData); // Write raw base64
  
      const options = {
        mode: "text",
        pythonPath: "python3",
        scriptPath: "./scripts",
        args: [inputPath],
      };
  
      PythonShell.run("image_payload.py", options)
        .then((results) => {
          fs.unlinkSync(inputPath); // Clean up the input file
          console.log("Python script results:", results);
          res.json({ detectedLetter: results ? results[0] : "Unknown" });
        })
        .catch((err) => {
          fs.existsSync(inputPath) && fs.unlinkSync(inputPath); // Clean up the input file
          console.error("Error running Python script:", err);
          res.status(500).json({ error: "Python script error", details: err.message });
        });
    } catch (error) {
      console.error("Error processing request:", error);
      return res.status(400).json({ error: "Request processing error", details: error.message });
    }
  });

app.listen(5000, () => console.log("🚀 Server running on port 5000"));
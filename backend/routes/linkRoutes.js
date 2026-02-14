const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const Link = require("../models/Link");
const bcrypt = require("bcrypt");

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    const allowedTypes = ["image/png", "image/jpeg", "application/pdf"];
    if (!allowedTypes.includes(file.mimetype)) {
      cb(new Error("Only PNG, JPG, PDF allowed"));
    } else {
      cb(null, true);
    }
  }
});



router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const { text, expiry, password, maxViews } = req.body;


    // Validate: Only one of text OR file
    if (!text && !req.file) {
      return res.status(400).json({ message: "Provide text or file" });
    }

    if (text && req.file) {
      return res.status(400).json({ message: "Upload either text or file, not both" });
    }

    const uniqueId = uuidv4();

    const expiresAt = expiry
      ? new Date(expiry)
      : new Date(Date.now() + 10 * 60 * 1000);

    let hashedPassword = null;

    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }


    const newLink = new Link({
      uniqueId,
      text: text || null,
      fileUrl: req.file ? req.file.path : null,
      expiresAt,
      password: hashedPassword,
     maxViews: maxViews ? parseInt(maxViews) : null,
viewCount: 0

    });


    await newLink.save();

    res.status(200).json({
      link: `http://localhost:${process.env.PORT}/${uniqueId}`
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});


const path = require("path");
router.get("/download/:id", async (req, res) => {
  try {
    const link = await Link.findOne({ uniqueId: req.params.id });

    if (!link || !link.fileUrl) {
      return res.status(404).json({ message: "File not found" });
    }

    if (new Date() > link.expiresAt) {
      return res.status(410).json({ message: "Link expired" });
    }
  
    const filePath = path.resolve(link.fileUrl);
    res.download(filePath);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const link = await Link.findOne({ uniqueId: req.params.id });

    if (!link) {
      return res.status(404).json({ message: "Link not found" });
    }

    // Delete file if exists
    if (link.fileUrl) {
      const fs = require("fs");
      fs.unlink(link.fileUrl, (err) => {
        if (err) console.log("File delete error:", err);
      });
    }

    await Link.deleteOne({ uniqueId: req.params.id });

    res.json({ message: "Link deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const link = await Link.findOne({ uniqueId: req.params.id });

    if (!link) {
      return res.status(403).json({ message: "Invalid or expired link" });
    }

    if (new Date() > link.expiresAt) {
      return res.status(403).json({ message: "Link expired" });
    }

    // Password protection
    if (link.password) {
      const enteredPassword = req.query.password;

      if (!enteredPassword) {
        return res.status(401).json({ message: "Password required" });
      }

      const match = await bcrypt.compare(enteredPassword, link.password);

      if (!match) {
        return res.status(403).json({ message: "Incorrect password" });
      }
    }

    // Max views check
    if (link.maxViews && link.viewCount >= link.maxViews) {
      return res.status(410).json({ message: "Maximum views reached" });
    }

    // Increase view count
    link.viewCount += 1;
    await link.save();


    return res.json({
      text: link.text,
      fileUrl: link.fileUrl,
      expiresAt: link.expiresAt
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// const path = require("path");




module.exports = router;


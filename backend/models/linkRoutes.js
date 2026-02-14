const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const Link = require("../models/Link");

router.post("/upload", async (req, res) => {
  try {
    const { text, expiry } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Text is required" });
    }

    const uniqueId = uuidv4();

    const expiresAt = expiry
      ? new Date(expiry)
      : new Date(Date.now() + 10 * 60 * 1000);

    const newLink = new Link({
      uniqueId,
      text,
      expiresAt
    });

    await newLink.save();

    res.status(200).json({
      link: `http://localhost:5000/${uniqueId}`
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;


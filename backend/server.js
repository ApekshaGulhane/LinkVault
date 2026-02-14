require("dotenv").config();

const cron = require("node-cron");
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();


app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("LinkVault Backend Running ");
});
const linkRoutes = require("./routes/linkRoutes");
app.use("/", linkRoutes);


const authRoutes = require("./routes/authRoutes");
app.use("/auth", authRoutes);


// MongoDB Connection
console.log("ENV VALUE:", process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected "))
  .catch((err) => console.log("MongoDB Error ", err));


const PORT = process.env.PORT || 5000;

const Link = require("./models/Link");

cron.schedule("* * * * *", async () => {
  try {
    const expiredLinks = await Link.find({
      expiresAt: { $lt: new Date() }
    });

    for (let link of expiredLinks) {

      // Delete file if exists
      if (link.fileUrl) {
        fs.unlink(link.fileUrl, (err) => {
          if (err) console.log("File delete error:", err);
        });
      }

      // Delete from DB
      await Link.deleteOne({ _id: link._id });
      console.log("Deleted expired link:", link.uniqueId);
    }

  } catch (err) {
    console.log("Cron error:", err);
  }
});


app.listen(PORT, () => {
 console.log(`Server running on port ${PORT}`);
});

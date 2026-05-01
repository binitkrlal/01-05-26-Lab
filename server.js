const express = require("express");
const mongoose = require("mongoose");
const shortid = require("shortid");
const Url = require("./models/Url");

const app = express();
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/urlShortener")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));


app.post("/shorten", async (req, res) => {
  const { originalUrl } = req.body;

  const shortId = shortid.generate();

  const newUrl = new Url({ originalUrl, shortId });
  await newUrl.save();

  res.json({
    shortUrl: `http://localhost:5000/${shortId}`
  });
});


app.get("/:shortId", async (req, res) => {
  const url = await Url.findOne({ shortId: req.params.shortId });

  if (url) {
    res.redirect(url.originalUrl);
  } else {
    res.send("URL not found");
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
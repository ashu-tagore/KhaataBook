// Import required modules
const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");

// Set EJS as the view engine
app.set("view engine", "ejs");

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Parse JSON bodies of incoming requests
app.use(express.json());

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
  fs.readdir(`./hisab`, function (err, files) {
    if (err) {
      return res.status(500).send(err);
    }
    res.render("index", { files });
  });
});

app.get("/create", (req, res) => {
  res.render("create");
});

app.post("/createhisaab", (req, res) => {
  var currentDate = new Date();
  var date = `${currentDate.getDate()}-${
    currentDate.getMonth() + 1
  }-${currentDate.getFullYear()}`;

  fs.writeFile(`./hisab/${date}.txt`, req.body.content, function (err, data) {
    if (err) {
      return res.status(500).send(err);
    }
    res.redirect("/");
  });
});

app.get("/edit/:filename", (req, res) => {
  fs.readFile(
    `./hisab/${req.params.filename}`,
    "utf-8",
    function (err, filedata) {
      if (err) {
        return res.status(404).send("File not found");
      }
      res.render("edit", { filedata, filename: req.params.filename });
    }
  );
});

app.post("/update/:filename", (req, res) => {
  fs.writeFile(
    `./hisab/${req.params.filename}`,
    req.body.content,
    function (err, data) {
      if (err) {
        return res.status(500).send(err);
      }
      res.redirect("/");
    }
  );
});

app.get("/hisab/:filename", (req, res) => {
  fs.readFile(
    `./hisab/${req.params.filename}`,
    "utf-8",
    function (err, filedata) {
      if (err) return res.status(500).send(err);
      res.render("hisaab", { filedata, filename: req.params.filename });
    }
  );
});

app.get("/delete/:filename", (req, res) => {
  fs.unlink(`./hisab/${req.params.filename}`, function (err) {
    if (err) return res.status(500).send(err);
    res.redirect("/");
  });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

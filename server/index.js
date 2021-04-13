const express = require("express");
const exphbs = require("express-handlebars");
const fileUpload = require("express-fileupload");

const app = express();
const port = process.env.PORT || 5000;

//default option
app.use(fileUpload());

//Templating engine
app.engine("hbs", exphbs({ extname: ".hbs" }));
app.set("view engine", "hbs");

app.get("", (req, res) => {
  res.render("index");
});

app.post("", (req, res) => {
  let sampleFile;
  let uploadPath;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded");
  }

  sampleFile = req.files.sampleFile;
  console.log(sampleFile);

  //use mv() (move function) to place file on the server
  sampleFile.mv()

});

app.listen(port, () => console.log(`Listening on port ${port}`));

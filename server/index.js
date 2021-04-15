const express = require("express");
const exphbs = require("express-handlebars");
const fileUpload = require("express-fileupload");
const fs = require("fs");

const app = express();
const port = process.env.PORT || 5000;

//default option
app.use(fileUpload());

//static Files
app.use(express.static("public"));
app.use(express.static("upload"));

//Templating engine
app.engine("hbs", exphbs({ extname: ".hbs" }));
app.set("view engine", "hbs"); //установка handlebars в качестве движка представлений в express

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
  uploadPath = __dirname + "/upload/" + sampleFile.name;
  console.log(sampleFile);
  let fileContent = fs.readFileSync(uploadPath, "utf8");
  let pixelParams = fileContent.matchAll(/(\d+)\D*/g);
  pixelParams = Array.from(pixelParams);
  let width = pixelParams[0][1];
  let height = pixelParams[1][1];
  let colors = new Array();
  for (let i = 2; i < pixelParams.length; i++) {
    colors[i - 2] = Number(pixelParams[i][1]).toString(16);
  }
  
  console.log(typeof colors, colors);
  //use mv() (move function) to place file on the server
  sampleFile.mv(uploadPath, function (err) {
    if (err) return res.status(500).send(err);
    res.render("index", {
      fileData: sampleFile.data,
      width: width,
      height: height,
      colors: colors,
      pixelParams: pixelParams,
    });
  });
});

app.listen(port, () => console.log(`Listening on port ${port}`));

const express = require("express");
const engine = require("ejs-blocks");
const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const app = express();
const { processImage } = require("./process");
const bodyParser = require("body-parser");

app.set("views", __dirname + "/views");
app.engine("ejs", engine);
app.set("view engine", "ejs");

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    let extArray = file.mimetype.split("/");
    let extension = extArray[extArray.length - 1];
    cb(null, file.fieldname + "-" + Date.now() + "." + extension);
  },
});
const upload = multer({ storage: storage });

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

const PORT = 3000;
function rnd(t) {
  let str = "";
  const min = t === "a" ? 10 : 0;
  const max = t === "n" ? 10 : 62;
  for (let i = 0; i++ < 3; ) {
    let r = (Math.random() * (max - min) + min) << 0;
    str += String.fromCharCode((r += r > 9 ? (r < 36 ? 55 : 61) : 48));
  }
  return str;
}

function generateUniqSerial() {
  return `${rnd("a")}-${rnd("n")}-${rnd("a")}`;
}

app.get("/download", async (req, res) => {
  var file = __dirname + "/data.json";
  res.download(file, "data.json");
});

app.get("/", async (req, res) => {
  try {
    let passes = await fs.readFileSync("./data.json");
    passes = JSON.parse(passes);
    passes = passes.passes;

    const members = passes.reduce((acc, item) => {
      return parseInt(acc) + parseInt(item.passes);
    }, 0);

    res.render("index", {
      count: passes.length,
      members: members,
    });
  } catch (error) {
    console.log(error);
  }
});

app.post("/upload", async (req, res) => {
  try {
    let passes = await fs.readFileSync("./data.json");
    passes = JSON.parse(passes);
    passes = passes.passes;

    const serial = generateUniqSerial();
    const outputImage = await processImage(
      {
        ...req.body,
        serial,
      },
      1200,
      1686
    );
    await fs.writeFileSync("./image.png", outputImage);
    var file = __dirname + "/image.png";

    await fs.writeFileSync(
      "./data.json",
      JSON.stringify({
        passes: [
          ...passes,
          {
            ...req.body,
            serial,
          },
        ],
      })
    );

    res.download(file, "image.png");
    // res.redirect("/");
  } catch (error) {
    console.log("error : ", error);
    res.redirect("/");
  }
});

app.listen(PORT, () => {
  console.log("Listening at " + PORT);
});

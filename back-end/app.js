var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
var multer = require("multer");
var bodyParser = require("body-parser");

var app = express();
app.use(cors());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var rolesRouter = require("./routes/roles");
var mekanikRouter = require("./routes/mekanik");
var kerusakanRouter = require("./routes/kerusakan");
var sparepartRouter = require("./routes/sparepart");
var machineRouter = require("./routes/machine");
var transaksiSparepartRouter = require("./routes/transaksiSparepart");
var gudangMekanikRouter = require("./routes/gudangMekanik");
var perbaikanRouter = require("./routes/perbaikan");
var authRouter = require("./routes/auth");


app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/roles", rolesRouter);
app.use("/mekanik", mekanikRouter);
app.use("/kerusakan", kerusakanRouter);
app.use("/sparepart", sparepartRouter);
app.use("/machine", machineRouter);
app.use("/transaksiSparepart", transaksiSparepartRouter);
app.use("/gudangMekanik", gudangMekanikRouter);
app.use("/perbaikan", perbaikanRouter);
app.use("/auth", authRouter);

// determining upload location
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./public/images");
  },
  filename: async function (req, file, callback) {
    callback(null, file.originalname + "-" + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

app.post("/upload", upload.single("photo"), async (req, res) => {
  // membuat url gambar dan save ke db
  let finalImageURL =
    "https://transmetalroof.com:5000/images/" + req.file?.filename;
  res.json({ status: "uploaded successfully", image: finalImageURL });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;

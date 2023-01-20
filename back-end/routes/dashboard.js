var express = require("express");
var router = express.Router();

const dashboard = require("../controllers/Dashboard");

router.get("/summary", dashboard.getSummary);

module.exports = router;

var express = require("express");
var router = express.Router();

const transaksiSparepart = require("../controllers/TransaksiSparepart");
const perbaikan = require("../controllers/Perbaikan");

router.get("/transaksiSparepart", transaksiSparepart.exportData);
router.get("/perbaikan", perbaikan.exportData);

module.exports = router;

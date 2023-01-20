var express = require("express");
var router = express.Router();

const controller = require("../controllers/LoCounter");

router.get("/", controller.findAll);
router.get("/:id", controller.findOne);


module.exports = router;

var express = require("express");
var router = express.Router();

const controller = require("../controllers/GudangMekanik");

router.get("/", controller.findAll);
router.get("/:id", controller.findOne);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);

module.exports = router;

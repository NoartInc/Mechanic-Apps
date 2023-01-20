var express = require("express");
var router = express.Router();

const controller = require("../controllers/TransaksiSparepart");
const authorization = require("../middleware/authorization");

router.get("/", controller.findAll);
router.get("/:id", controller.findOne);
router.post("/", authorization, controller.create);
router.put("/:id", authorization, controller.update);
router.delete("/:id", authorization, controller.delete);

module.exports = router;

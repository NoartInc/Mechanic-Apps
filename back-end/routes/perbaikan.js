var express = require("express");
var router = express.Router();

const controller = require("../controllers/Perbaikan");
const authorization = require("../middleware/authorization");
const { upload } = require("../middleware/uploadfile");

router.get("/", controller.findAll);
router.get("/:id", controller.findOne);
router.post("/", authorization, controller.create);
router.put("/:id", authorization, controller.update);
router.patch("/status/:id", authorization, controller.updateStatus);
router.patch(
  "/upload/photo/:id",
  authorization,
  upload.single("uploadPhotos"),
  controller.uploadPhoto
);
router.patch("/remove/photo/:id", authorization, controller.removePhoto);
router.delete("/:id", authorization, controller.delete);

module.exports = router;

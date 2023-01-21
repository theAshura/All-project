const path = require("path");
const express = require("express");
const router = express.Router();

router.use("/", express.static(path.join(__dirname, "../../build")));
router.use("/*", express.static(path.join(__dirname, "../../build")));
module.exports = router;

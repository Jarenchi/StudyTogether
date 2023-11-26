const express = require("express");
const { checkApplicationJson } = require("../middlewares/checkApplicationJson");
const { verifyAccessToken } = require("../middlewares/verifyAccessToken");
const { clubCreate } = require("../controllers/club/clubCreate");
const { clubAllList } = require("../controllers/club/clubAllList");
const { clubJoin } = require("../controllers/club/clubJoin");
const router = express.Router();
router.post("/", checkApplicationJson, verifyAccessToken, clubCreate);
router.get("/all", clubAllList);
router.post("/join", checkApplicationJson, verifyAccessToken, clubJoin);
module.exports = router;

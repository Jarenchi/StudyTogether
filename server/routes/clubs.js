const express = require("express");
const { checkApplicationJson } = require("../middlewares/checkApplicationJson");
const { verifyAccessToken } = require("../middlewares/verifyAccessToken");
const { clubCreate } = require("../controllers/club/clubCreate");
const { clubAllList } = require("../controllers/club/clubAllList");
const { clubJoin } = require("../controllers/club/clubJoin");
const { createDoc } = require("../controllers/docs/createDoc");
const { getAllDocs } = require("../controllers/docs/getAllDocs");
const { getDocById } = require("../controllers/docs/getDocById");
const { updateDocTitle } = require("../controllers/docs/updateDocTitle");
const { updateDocContent } = require("../controllers/docs/updateDocContent");
const { deleteDoc } = require("../controllers/docs/deleteDoc");
const checkClubPermission = require("../middlewares/checkClubPermission");
const router = express.Router();
router.post("/", checkApplicationJson, verifyAccessToken, clubCreate);
router.get("/all", clubAllList);
router.post("/join", checkApplicationJson, verifyAccessToken, clubJoin);

router.post("/:clubId/docs", checkClubPermission, createDoc);
router.get("/:clubId/docs", getAllDocs);
router.get("/:clubId/docs/:docId", verifyAccessToken, getDocById);
router.put("/:clubId/docs/:docId/title", verifyAccessToken, updateDocTitle);
router.put("/:clubId/docs/:docId", verifyAccessToken, updateDocContent);
router.delete("/:clubId/docs/:docId", verifyAccessToken, deleteDoc);

module.exports = router;

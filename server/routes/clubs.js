const express = require("express");
const { checkApplicationJson } = require("../middlewares/checkApplicationJson");
const { verifyAccessToken } = require("../middlewares/verifyAccessToken");
const { checkFormData } = require("../middlewares/checkFormData");
const { uploadImage } = require("../middlewares/uploadImage");
const { clubCreate } = require("../controllers/club/clubCreate");
const { clubAllList } = require("../controllers/club/clubAllList");
const { clubJoin } = require("../controllers/club/clubJoin");
const { createDoc } = require("../controllers/docs/createDoc");
const { getAllDocs } = require("../controllers/docs/getAllDocs");
const { getDocById } = require("../controllers/docs/getDocById");
const { updateDocTitle } = require("../controllers/docs/updateDocTitle");
const { updateDocContent } = require("../controllers/docs/updateDocContent");
const { deleteDoc } = require("../controllers/docs/deleteDoc");
const { getAllMembers } = require("../controllers/members/getAllMembers");
const { deleteMember } = require("../controllers/members/deleteMember");
const { createEvent } = require("../controllers/events/createEvent");

const router = express.Router();
router.post("/", verifyAccessToken, checkFormData, uploadImage, clubCreate);
router.get("/all", clubAllList);
router.post("/join", checkApplicationJson, verifyAccessToken, clubJoin);

router.post("/:clubId/docs", createDoc);
router.get("/:clubId/docs", getAllDocs);
router.get("/:clubId/docs/:docId", verifyAccessToken, getDocById);
router.put("/:clubId/docs/:docId/title", verifyAccessToken, updateDocTitle);
router.put("/:clubId/docs/:docId", verifyAccessToken, updateDocContent);
router.delete("/:clubId/docs/:docId", verifyAccessToken, deleteDoc);

router.get("/:clubId/members", verifyAccessToken, getAllMembers);
router.delete("/:clubId/members/:userId", deleteMember);

router.post("/:clubId/events", createEvent);

module.exports = router;

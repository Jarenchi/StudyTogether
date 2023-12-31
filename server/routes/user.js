const express = require("express");
const router = express.Router();
const { userSignUp } = require("../controllers/user/userSignUp");
const { userSignIn } = require("../controllers/user/userSignIn");
const { getUserClubs } = require("../controllers/user/getUserClubs");
const { getUserProfile } = require("../controllers/user/getUserProfile");
const { checkApplicationJson } = require("../middlewares/checkApplicationJson");
const { validateSignUp } = require("../middlewares/validateSignUp");
const { verifyAccessToken } = require("../middlewares/verifyAccessToken");
const getAllUsages = require("../controllers/usage/getAllUsage");
const getUsageByDate = require("../controllers/usage/getUsageByDate");
const createUsage = require("../controllers/usage/createUsage");
const updateUsageById = require("../controllers/usage/updateUsageById");

router.post("/signup", checkApplicationJson, validateSignUp, userSignUp);
router.post("/signin", checkApplicationJson, userSignIn);
router.get("/:userId/clubs", verifyAccessToken, getUserClubs);
router.get("/:userId/profile", verifyAccessToken, getUserProfile);
router.get("/:userId/usages/all", verifyAccessToken, getAllUsages);
router.get("/:userId/usages", verifyAccessToken, getUsageByDate);
router.post("/:userId/usages", verifyAccessToken, createUsage);
router.put("/:userId/usages/:id", verifyAccessToken, updateUsageById);
module.exports = router;

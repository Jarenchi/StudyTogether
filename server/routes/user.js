const express = require("express");
const { userSignUp } = require("../controllers/user/userSignUp");
const { userSignIn } = require("../controllers/user/userSignIn");
const { checkApplicationJson } = require("../middlewares/checkApplicationJson");
const { validateSignUp } = require("../middlewares/validateSignUp");
const router = express.Router();
router.post("/signup", checkApplicationJson, validateSignUp, userSignUp);
router.post("/signin", checkApplicationJson, userSignIn);
module.exports = router;

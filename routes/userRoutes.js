const express = require("express");
const ValidateToken = require("../middleware/validtokenhandler");
const router = express.Router();
const {registerUser,LoginUser,currentUser, Otpchecker} = require("../controllers/userControllers");

router.post("/register",registerUser);


router.post("/login",LoginUser);
router.post("/send-otp", Otpchecker);


router.get("/current", ValidateToken, currentUser);

module.exports = router;

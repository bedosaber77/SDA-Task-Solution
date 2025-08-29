const authController = require("../controllers/auth.controller");
const router = require("express").Router();

router.post("/signup", authController.register);
router.post("/login", authController.login);
router.get("/verify", authController.verify);

module.exports = router;

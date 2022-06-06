const express = require("express");
const router = express.Router();
const UsersController = require("../controller/users");
const handleErrorAsync = require("../service/handleErrorAsync");
const auth = require("../middleware/auth");

router.get("/", UsersController.getAllUsers);
router.get("/profile", auth.isAuth, UsersController.getProfile);

router.post("/sign_in", UsersController.signin);
router.post("/sign_up", UsersController.register);
router.patch("/profile", auth.isAuth, UsersController.updateUser);
router.delete("/:id", UsersController.deleteUser);
router.post("/updatePassword", auth.isAuth, UsersController.updatePassword);
module.exports = router;

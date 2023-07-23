const router = require("express").Router();
const { validateUserData } = require("../middlewares/validate");
const { getOwner, updateUser } = require("../controllers/users");

router.get("/me", getOwner);
router.patch("/me", validateUserData, updateUser);

module.exports = router;

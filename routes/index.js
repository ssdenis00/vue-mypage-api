const router = require("express").Router();
const usersRoutes = require("./users");
const auth = require("../middlewares/auth");
const {
  validateCreateUser,
  validateLogin,
} = require("../middlewares/validate");
const { login, createUser } = require("../controllers/users");
const NoFoundError = require("../errors/noFoundError");

router.post("/signin", validateLogin, login);
router.post("/signup", validateCreateUser, createUser);

router.use("/users", auth, usersRoutes);

router.use("*", auth, () => {
  throw new NoFoundError("Страница не найдена");
});

module.exports = router;

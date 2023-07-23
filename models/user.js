const { isEmail } = require("validator");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const AuthorizationError = require("../errors/authorizationError");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [
      isEmail,
      "При регистрации указан email, который уже существует на сервере.",
    ],
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    minLength: 2,
    maxLength: 30,
    required: true,
  },
});

userSchema.statics.findUserByCredentials = function findUser(email, password) {
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return Promise.reject(
          new AuthorizationError("Неправильные почта или пароль")
        );
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(
            new AuthorizationError("Неправильные почта или пароль")
          );
        }

        return user;
      });
    });
};

module.exports = mongoose.model("user", userSchema);

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { JWT_SECRET } = require('../utils/constants');
const User = require('../models/user');
const AuthorizationError = require('../errors/authorizationError');
const IncorrectDataError = require('../errors/incorrectDataError');
const CheckRepeatEmailError = require('../errors/checkRepeatEmailError');
const NoFoundError = require('../errors/noFoundError');

module.exports.createUser = (req, res, next) => {
  const {
    email,
    password,
    name,
  } = req.body;

  if (email !== false || password !== false) {
    bcrypt.hash(password, 10)
      .then((hash) => {
        User.create({
          email,
          password: hash,
          name,
        })
          .then((user) => {
            const { email: emailUser, name: nameUser, _id } = user;
            res.status(201).send({ email: emailUser, name: nameUser, _id });
          })
          .catch((err) => {
            if (err.name === 'ValidationError') {
              next(new IncorrectDataError('Переданы некорректные данные.'));
            } else if (err.code === 11000) {
              next(new CheckRepeatEmailError('При регистрации указан email, который уже существует на сервере.'));
            } else {
              next(err);
            }
          });
      })
      .catch((err) => {
        if (err.name === 'ValidationError') {
          next(new IncorrectDataError('Переданы некорректные данные.'));
        } else {
          next(err);
        }
      });
  } else {
    next(new IncorrectDataError('Переданы некорректные данные.'));
  }
};

module.exports.updateUser = (req, res, next) => {
  if (req.body.name !== false || req.body.email !== false) {
    User.findByIdAndUpdate(
      req.user._id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    )
      .then((user) => {
        if (!user) {
          next(new NoFoundError('Пользователь не найден.'));
        } else {
          res.status(200).send(user);
        }
      })
      .catch((err) => {
        if (err.name === 'ValidationError') {
          next(new IncorrectDataError('Переданы некорректные данные.'));
        } else if (err.code === 11000) {
          next(new CheckRepeatEmailError('Этот email уже существует на сервере.'));
        } else {
          next(err);
        }
      });
  } else {
    next(new IncorrectDataError('Переданы некорректные данные.'));
  }
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET);

      // вернём токен
      res.send({ token });
    })
    .catch(() => {
      next(new AuthorizationError('Неправильные почта или пароль'));
    });
};

module.exports.getOwner = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        next(new NoFoundError('Пользователь не найден.'));
      } else {
        res.status(200).send(user);
      }
    })
    .catch((err) => {
      next(err);
    });
};

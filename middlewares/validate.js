const { celebrate, Joi } = require("celebrate");
const validator = require("validator");

const checkUrl = (value) => {
  const result = validator.isURL(value);
  if (result) {
    return value;
  }

  throw new Error("URL validation err");
};

const validateCreateUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().required(),
  }),
});

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const validateId = celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24).required(),
  }),
});

const validateUserData = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).required(),
    email: Joi.string().required().email(),
  }),
});

module.exports = {
  validateCreateUser,
  validateLogin,
  validateId,
  validateUserData,
};

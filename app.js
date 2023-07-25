const express = require("express");

require("dotenv").config();

const mongoose = require("mongoose");
const helmet = require("helmet");
const { errors } = require("celebrate");
const limiter = require("./middlewares/limiter");
const { DATA_BASE, PORT } = require("./utils/constants");
const routes = require("./routes/index");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const errorsMiddleware = require("./middlewares/errors");

const allowedCors = ["http://localhost:5173", "http://localhost:3000"];

const app = express();

mongoose.connect(DATA_BASE, {
  useNewUrlParser: true,
});

app.use(helmet());

app.use(limiter);

app.use((req, res, next) => {
  const { origin } = req.headers;
  const { method } = req;
  const DEFAULT_ALLOWED_METHODS = "GET,HEAD,PUT,PATCH,POST,DELETE";
  const requestHeaders = req.headers["access-control-request-headers"];

  if (allowedCors.includes(origin)) {
    res.header("Access-Control-Allow-Origin", "*");
  }

  if (method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", DEFAULT_ALLOWED_METHODS);
    res.header("Access-Control-Allow-Headers", requestHeaders);
    return res.end();
  }

  return next();
});

app.use(express.json());

app.use(requestLogger);

app.use(routes);

app.use(errorLogger);

app.use(errors());

app.use(errorsMiddleware);

app.listen(PORT);

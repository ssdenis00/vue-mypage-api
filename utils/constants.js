const { DATA_BASE = "mongodb://localhost:27017/mypage" } = process.env;
const { JWT_SECRET = "some-secret-key" } = process.env;
const { PORT = 3000 } = process.env;

module.exports = {
  DATA_BASE,
  JWT_SECRET,
  PORT,
};

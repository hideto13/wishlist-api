const {
  MONGO_DATA_BASE = 'mongodb://127.0.0.1:27017/wishesdb',
  NODE_ENV = 'development',
  JWT_SECRET,
  JWT_DEV_SECRET = 'secret',
  PORT = 3000,
} = process.env

module.exports = {
  MONGO_DATA_BASE,
  NODE_ENV,
  JWT_SECRET,
  JWT_DEV_SECRET,
  PORT,
}

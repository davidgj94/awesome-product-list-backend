import dotenv from "dotenv";

dotenv.config();

export default {
  PORT: parseInt(process.env.SERVER_PORT || "8000", 10),
  DATABASE_URL:
    process.env.DATABASE_URL ||
    "mongodb://localhost:27017/awesome-product-list",
  API_URL: process.env.API_URL || "http://localhost:8000/api/v1",
  MAX_RETRIES: 3,
  VOLUME_UPDATE_RATE: 0.9,
  VOLUME_INTERVAL_HOURS: 5,
  JWT_SECRET: process.env.JWT_SECRET || "asdf",
  JWT_EXPIRES_DAYS: process.env.JWT_EXPIRES_DAYS
    ? Number(process.env.JWT_EXPIRES_DAYS)
    : 7,
};

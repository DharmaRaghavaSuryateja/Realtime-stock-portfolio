import { Sequelize } from 'sequelize-typescript';
import config from '../config';
import User from '../models/User';
import UserStock from '../models/UserStock';

const sequelize = new Sequelize({
  host: config.database.host,
  port: config.database.port,
  username: config.database.username,
  password: config.database.password,
  database: config.database.database,
  dialect: config.database.dialect,
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  models: [User, UserStock],
  dialectOptions: {
    ssl: {
      require: true,
      ca: process.env.DB_CERT,
      rejectUnauthorized: false,
    },
  },
});

export default sequelize;

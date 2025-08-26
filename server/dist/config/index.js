import dotenv from 'dotenv';
dotenv.config();
const config = {
    port: Number(process.env.PORT) || 8000,
    nodeEnv: process.env.NODE_ENV || 'development',
    database: {
        host: process.env.DB_HOST || '127.0.0.1',
        port: Number(process.env.DB_PORT) || 3306,
        username: process.env.DB_USERNAME || '',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'stock_portfolio',
        dialect: 'mysql',
    },
    jwt: {
        accessSecret: process.env.JWT_ACCESS_SECRET || 'access-secret-key',
        refreshSecret: process.env.JWT_REFRESH_SECRET || 'refresh-secret-key',
        accessExpiry: process.env.JWT_ACCESS_EXPIRY || '45m',
        refreshExpiry: process.env.JWT_REFRESH_EXPIRY || '7d',
    },
};
export default config;

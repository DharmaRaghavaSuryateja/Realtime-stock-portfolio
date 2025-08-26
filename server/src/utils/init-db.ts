import sequelize from '@/db';
import config from '@/config';
import mysql from 'mysql2/promise';

export async function initializeDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: config.database.host,
      port: config.database.port,
      user: config.database.username,
      password: config.database.password,
    });

    await connection.execute(
      `CREATE DATABASE IF NOT EXISTS \`${config.database.database}\``,
    );
    console.log(`Database '${config.database.database}' is ready.`);

    await connection.end();

    await sequelize.authenticate();
    console.log('Connected to the database successfully.');

    await sequelize.sync({ force: false });
    console.log('Database models synchronized successfully.');

    return true;
  } catch (error) {
    console.error('Unable to connect to the database', error);
    return false;
  }
}

export async function closeDatabase() {
  try {
    await sequelize.close();
    console.log('Database connection closed.');
  } catch (error) {
    console.error('Error closing database connection:', error);
  }
}

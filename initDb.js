// Database credentials (Replace with your actual database credentials)
import pgPromise from "pg-promise";
import { Sequelize } from "sequelize";

// PostgreSQL Database credentials
const DATABASE = "shiba";
const USER = "shiba";
const PASSWORD = "shiba";
const HOST = "localhost"; // Usually "localhost" for local development
const PORT = 5432; // Replace with your database port number (default is 5432 for PostgreSQL)

// Connect to PostgreSQL database using pg-promise
const pgp = pgPromise();
const db = pgp(`postgres://${USER}:${PASSWORD}@${HOST}:${PORT}/${DATABASE}`);

// Connect to PostgreSQL database using Sequelize
const sequelize = new Sequelize(DATABASE, USER, PASSWORD, {
  host: HOST,
  dialect: "postgres",
  port: PORT,
});

const initializeDb = async () => {
  try {
    // PostgreSQL with pg-promise
    await db.connect();
    console.log("Successfully connected to the database using pg-promise");

    // PostgreSQL with Sequelize
    await sequelize.authenticate();
    console.log("Successfully connected to the database using Sequelize");

    // Create tables if they do not exist
    await sequelize.sync({
      force: false, // Set to true during development to drop and recreate tables
      alter: false,
    });
    console.log("Database synced with Sequelize");
  } catch (error) {
    console.log("\x1b[31m%s\x1b[0m", `Error syncing: ${error.message}`);
  }
};
export { initializeDb, sequelize };

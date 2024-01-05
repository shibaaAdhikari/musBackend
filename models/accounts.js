import { DataTypes } from "sequelize";
import { sequelize } from "../initDb.js";

const Account = sequelize.define('Account', {
    userId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true, // Auto-generate user IDs
        allowNull: true, // Allow automatic generation
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    refreshToken: {
        type: DataTypes.STRING, // Use an appropriate data type for tokens
        allowNull: true, // Tokens may not exist for all accounts
    }  
});

export default Account;

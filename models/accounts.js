import { DataTypes } from "sequelize";
import { sequelize } from "../initDb.js";

const Account = sequelize.define('Account', {
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
    tokenId: {
      type: DataTypes.STRING, // Use an appropriate data type for token IDs
      allowNull: true, // Tokens may not exist for all accounts
      unique: true, // Ensure each token is associated with only one account
  },
});

export default Account;

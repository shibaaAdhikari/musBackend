import { DataTypes } from "sequelize";
import { sequelize } from "../initDb.js";

const Admin = sequelize.define("Admin", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  username: {
    type: DataTypes.CHAR,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.CHAR,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.CHAR,
    allowNull: false,
  },
  profilePicture: {
    type: DataTypes.CHAR,
    allowNull: true,
  },
});

export default Admin;

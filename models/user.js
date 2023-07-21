import { DataTypes } from "sequelize";
import { sequelize } from "../initDb.js";

const User = sequelize.define("User", {
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
  liked: {
    type: DataTypes.ARRAY(DataTypes.CHAR),
    allowNull: true,
  },
  createdPlaylists: {
    type: DataTypes.ARRAY(DataTypes.CHAR),
    allowNull: true,
  },
  followedPlaylists: {
    type: DataTypes.ARRAY(DataTypes.CHAR),
    allowNull: true,
  },
  preference: {
    type: DataTypes.CHAR(4),
    defaultValue: "opus",
  },
});

// User.sync()
//   .then(() => {
//     console.log("User table created successfully");
//   })
//   .catch((error) => {
//     console.error("Error creating User table:", error);
//   });

export default User;

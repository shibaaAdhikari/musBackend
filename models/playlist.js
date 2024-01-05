import { DataTypes } from "sequelize";
import { sequelize } from "../initDb";
import User from "./user.js";

const Playlist = sequelize.define("Playlist", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: DataTypes.CHAR,
    allowNull: false,
  },
  duration: {
    type: DataTypes.TIME,
  },
  durationInSeconds: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  songs: {
    type: DataTypes.ARRAY(DataTypes.UUID),
  },
  follows: {
    type: DataTypes.ARRAY(DataTypes.UUID),
  },
  creator: {
    type: DataTypes.UUID,
    references: {
      model: User,
      key: "id",
    },
    allowNull: false,
  },
});

export default Playlist;

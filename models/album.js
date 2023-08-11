import { DataTypes } from "sequelize";
import { sequelize } from "../initDb.js";

const Album = sequelize.define("Album", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  title: {
    type: DataTypes.CHAR,
    allowNull: false,
  },
  songs: {
    type: DataTypes.ARRAY(DataTypes.UUID),
    allowNull: true,
  },
  type: {
    type: DataTypes.CHAR(6),
    allowNull: false,
    defaultValue: "Album",
  },
  artist: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  coverArt: {
    type: DataTypes.CHAR,
  },
  year: {
    type: DataTypes.CHAR,
    allowNull: false,
  },
});

export default Album;

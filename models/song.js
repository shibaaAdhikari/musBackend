import { DataTypes } from "sequelize";
import { sequelize } from "../initDb.js";

const Song = sequelize.define("Song", {
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
  artist: {
    type: DataTypes.CHAR,
    allowNull: false,
  },
  featuredArtist: {
    type: DataTypes.ARRAY(DataTypes.CHAR),
  },
  genre: {
    type: DataTypes.ARRAY(DataTypes.CHAR),
    allowNull: false,
  },
  album: {
    type: DataTypes.CHAR,
    allowNull: false,
  },
  hash: {
    type: DataTypes.CHAR,
  },
  coverArt: {
    type: DataTypes.CHAR,
  },
  filePath: {
    type: DataTypes.CHAR,
  },
});

export default Song;

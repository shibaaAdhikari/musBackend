import { DataTypes } from "sequelize";
import { sequelize } from "../initDb.js";

const Favourites = sequelize.define("Favourites", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER, // Change the data type to INTEGER
    allowNull: false,
  },
  songId: { // Renamed from "songid" to follow naming conventions
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
  },
});

export default Favourites;

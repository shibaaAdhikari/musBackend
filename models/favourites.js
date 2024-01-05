import { DataTypes } from "sequelize";
import { sequelize } from "../initDb.js";

const Favourites = sequelize.define("Favourites", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING, // Assuming the username is a string
    allowNull: false,
  },
  songId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING, // Assuming title is a string
    allowNull: false,
  },
  songTitle: {
    type: DataTypes.STRING, // Assuming songTitle is a string
    allowNull: false,
  },
});


export default Favourites;

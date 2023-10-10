import { DataTypes } from "sequelize";
import { sequelize } from "../initDb.js"; // Import your Sequelize instance

// Define a Sequelize model for PlayCount
const PlayCount = sequelize.define("PlayCounts", {
  id: {
    type: DataTypes.UUID, // Data type for the 'id' field
    defaultValue: DataTypes.UUIDV4, // Generate a UUID for 'id'
    allowNull: false, // 'id' cannot be null
    primaryKey: true, // 'id' is the primary key
  },
  songId: {
        type: DataTypes.UUID, // Data type for the 'songId' field
        allowNull: false, // 'songId' cannot be null
      },
  count: {
    type: DataTypes.INTEGER, // Data type for the 'count' field
    allowNull: false, // 'count' cannot be null
    defaultValue: 0, // Set an initial play count of 0
  },
});

export default PlayCount;

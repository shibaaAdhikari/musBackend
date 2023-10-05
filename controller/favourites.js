import Favourites from "../models/favourites.js"
import Song from "../models/song.js";
import {SECRET_KEY} from "../env.js"; // Import your secret key constant
import jwt from 'jsonwebtoken';
import { body } from "express-validator";



// const create = async (req, res) => {
//   const { body, params } = req; // Use req.body to access the request body
//   const { username } = body; // Assuming the username is in the request body
//   const { songid } = params;
//   console.log(req);

//   try {
//     if (!username) {
//       throw new Error('Username is missing in the request body');
//     }

//     // Now you can use the username to associate the song with the correct user in your Favourites table
//     const newFavourite = await Favourites.create({
//       username, // Use the extracted username from the request body
//       songId: songid, // Assuming you have a songId
//     });

//     // Handle the response as needed
//     res.status(200).json({ message: 'Song added to favorites', data: newFavourite });
//   } catch (err) {
//     console.error(err);
//     res.status(401).json({ message: 'Invalid request body', error: err.message });
//   }
// };

const create = async (req, res) => {
  const { body, params } = req; // Use req.body to access the request body
  const { username, title, songTitle } = body; // Extract username, title, and songTitle
  const { songid } = params;
  console.log(req);

  try {
    if (!username) {
      throw new Error('Username is missing in the request body');
    }

    // Now you can use the username, title, and songTitle to create a favorite
    const newFavourite = await Favourites.create({
      username, // Use the extracted username from the request body
      songId: songid, // Assuming you have a songId
      title, // Assuming title is provided in the request body
      songTitle, // Assuming songTitle is provided in the request body
    });

    // Handle the response as needed
    res.status(200).json({ message: 'Song added to favorites', data: newFavourite });
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Invalid request body', error: err.message });
  }
};

const display = async (req, res) => {
  const { body } = req;
  const { username} = body;

  try {
    if (!username) {
      throw new Error('Username is missing in the request body');
    }

    // Query the database to retrieve the songs related to the user
    const userSongs = await Favourites.findAll({
      where: { username }, // Filter by username
    });

    // Handle the response as needed
    res.status(200).json({ message: 'User songs retrieved successfully', data: userSongs });
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Invalid request body', error: err.message });
  }
};

// const display = async (req, res) => {
//   const { body } = req;
//   const { username } = body;

//   try {
//     if (!username) {
//       throw new Error('Username is missing in the request body');
//     }

//     // Query the database to retrieve the songs related to the user from the favorites table
//     const userSongs = await Favourites.findAll({
//       where: { username }, // Filter by username
//     });

//     // Map the userSongs to get song details from the songs table
//     const songsDetails = await Promise.all(
//       userSongs.map(async (userSong) => {
//         const songId = userSong.songId;
//         const song = await Song.findOne({
//           attributes: ["title", "artist"],
//           where: { id: songId },
//         });
//         return song ? song.toJSON() : null;
//       })
//     );

//     // Handle the response as needed
//     res.status(200).json({ message: 'User songs retrieved successfully', data: songsDetails });
//   } catch (err) {
//     console.error(err);
//     res.status(401).json({ message: 'Invalid request body', error: err.message });
//   }
// };



const remove = async (req, res) => {
  try {
    const { username, songId } = req.body;

    // Delete the record from the "Favourites" table based on the username and songId.
    await Favourites.destroy({
      where: { username, songId },
    });

    res.status(200).json({ message: 'Song removed from favorites successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export {create,remove,display}
import Favourites from "../models/favourites.js"
import { SECRET_KEY } from "../env.js"; // Import your secret key constant
import jwt from 'jsonwebtoken';

const create = async (req, res) => {
    // console/log(req);
  try {
    const token = req.header('Authorization').replace('Bearer ', ''); // Get the JWT token from the request header
    const decoded = jwt.verify(token, SECRET_KEY); // Verify and decode the token using your secret key

    // Now `decoded` contains the user information, including the `userId`
    const { userId } = decoded;
    const { songId } = req.body;

    const newFavorite = await Favourites.create({ userId, songId });
    console.log('Created Favorite:', newFavorite);
    res.status(200).json({ message: 'Song added to favorites successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
}

const remove = async (req, res) => {

    try {
        const { userId, songId } = req.body;
        
        // Delete the record from the "Favourites" table.
        await Favourites.destroy({
            where: { userId, songId },
        });

        res.status(200).json({ message: 'Song removed from favorites successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
export {create,remove}
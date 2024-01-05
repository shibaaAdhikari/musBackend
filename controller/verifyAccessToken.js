import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../env.js';

const verifyAccessToken = (req, res, next) => {
    const accessToken = req.headers.authorization.split(' ')[1]; // Extract the token from the header
  
    jwt.verify(accessToken, SECRET_KEY, (err, user) => {
      if (err) {
        // Token is invalid or expired
        return res.status(401).json({ message: 'Access token expired or invalid' });
      }
      req.user = user; // Store the user information for use in the route handlers
      next();
    });
  };

export { verifyAccessToken };

import jwt from "jsonwebtoken";
import createError from "http-errors";

import { SECRET_KEY } from "../env.js";

const authorizeArtistAccount = (req, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      throw createError(401, "Unauthorized");
    }
    const decodedToken = jwt.verify(token, SECRET_KEY);
    const requestedArtistAccount = { id: decodedToken.id };
    return requestedArtistAccount;
  } catch (error) {
    console.log(error);
    throw createError(401, "Unauthorized");
  }
};

export default authorizeArtistAccount;

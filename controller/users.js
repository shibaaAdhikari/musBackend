import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import createError from "http-errors";

// import ArtistAccount from "../models/artistAccount";
// import Playlist from "../models/playlist";
import User from "../models/user.js";

import { SECRET_KEY } from "../env.js";

const signup = async (req, res, next) => {
  const errors = validationResult(req);

  const { username, email, password, profilePicture } = req.body;

  if (!errors.isEmpty()) {
    let errorMessage = "Invalid input: ";
    let invalidFields = [];
    errors.errors.forEach((errObj) => {
      if (!invalidFields.includes(errObj.param)) {
        invalidFields.push(errObj.param);
      }
    });

    invalidFields.forEach((error) => {
      errorMessage += `${error} `;
    });
    return next(createError(422, errorMessage));
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (error) {
    return next(createError(500, "Could not signup"));
  }

  const createdUser = User.build({
    username,
    email,
    password: hashedPassword,
    profilePicture,
    liked: [],
    createdPlaylists: [],
    followedPlaylists: [],
  });

  try {
    await createdUser.save();
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return next(createError(406, `${error.errors[0].path} already in use`));
    }
    return next(createError(500, "Signing up failed"));
  }

  let token;
  try {
    token = jwt.sign(
      {
        id: createdUser.id,
        username: createdUser.username,
        email: createdUser.email,
      },
      SECRET_KEY
    );
  } catch (error) {
    return next(createError(500, "Signing up failed"));
  }

  res.status(201).json({
    token: token,
    id: createdUser.id,
    preference: createdUser.preference,
  });
};

const signin = async (req, res, next) => {
  const errors = validationResult(req);

  let identify;

  if (!errors.isEmpty()) {
    return next(createError(422, "Validation error"));
  }

  const { username, password } = req.body;

  try {
    identify = await User.findOne({ where: { username } });
  } catch (error) {
    return next(createError(500, "Signin failed"));
  }

  if (!identify) {
    return next(
      createError(401, { message: `No user with username ${username}` })
    );
  }

  let isPasswordCorrect = false;
  try {
    let clippedPassword = identify.password.replace(/ /g, "");
    isPasswordCorrect = await bcrypt.compare(password, clippedPassword);
  } catch (error) {
    return next(createError(500, "Could not signin"));
  }

  if (!isPasswordCorrect) {
    return next(createError(401, `Wrong password for ${username}`));
  }

  let token;
  try {
    token = jwt.sign(
      {
        id: identify.id,
        username: identify.username,
        email: identify.email,
      },
      SECRET_KEY
    );
  } catch (error) {
    return next(createError(500, "Signin failed"));
  }

  res
    .status(200)
    .json({ token: token, id: identify.id, preference: identify.preference });
};

const checkUserAccount = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      return next(createError(401, "Unauthorized"));
    }

    const decodedToken = jwt.verify(token, SECRET_KEY);

    const userAccount = await User.findOne({ where: { id: decodedToken.id } });
    if (userAccount) {
      res.status(200).json({ result: "userAccount" });
    }

    // const artistAccount = await ArtistAccount.findOne({
    //   where: { id: decodedToken.id },
    // });
    // if (artistAccount) {
    //   res.status(200).json({ result: "artistAccount" });
    // }
  } catch (error) {
    return next(createError(500, "Invalid token"));
  }
};

const get = async (req, res, next) => {
  let userId;

  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return next(createError(401, "Unauthorized"));
    }
    const decodedToken = jwt.verify(token, SECRET_KEY);
    userId = decodedToken.id;
  } catch (error) {
    console.log(error);
    return next(createError(401, "Unauthorized"));
  }

  let user;

  try {
    user = await User.findOne({ where: { id: userId } });
  } catch (error) {
    return next(createError(500, `User fetch failed: ${error.message}`));
  }

  if (user === null) {
    return next(createError(404, `User not found`));
  }

  for (let key in user.dataValues) {
    if (typeof user.dataValues[key] === "string") {
      user.dataValues[key] = user.dataValues[key].trimEnd();
    }
  }

  for (let i in user.createdPlaylists) {
    user.createdPlaylists[i] = user.createdPlaylists[i].trimEnd();
  }

  res.json(user);
};

// const getPlaylists = async (req, res, next) => {
//   let userId;
//   try {
//     const token = req.headers.authorization.split(" ")[1];
//     if (!token) {
//       return next(createError(401, "Unauthorized"));
//     }
//     const decodedToken = jwt.verify(token, SECRET_KEY);
//     userId = decodedToken.id;
//   } catch (error) {
//     console.log(error);
//     return next(createError(401, "Unauthorized"));
//   }

//   let user;

//   try {
//     user = await User.findOne({ where: { id: userId } });
//   } catch (error) {
//     return next(createError(500, `User fetch failed: ${error.message}`));
//   }

//   if (user === null) {
//     return next(createError(404, `User not found`));
//   }

//   for (let key in user.dataValues) {
//     if (typeof user.dataValues[key] === "string") {
//       user.dataValues[key] = user.dataValues[key].trimEnd();
//     }
//   }

//   for (let i in user.createdPlaylists) {
//     user.createdPlaylists[i] = user.createdPlaylists[i].trimEnd();
//   }

//   let playlistData = [];

//   if (user.createdPlaylists.length !== 0) {
//     for (let playlistId of user.createdPlaylists) {
//       try {
//         const playlist = await Playlist.findOne({
//           where: {
//             id: playlistId,
//           },
//         });

//         playlistData.push({
//           id: playlistId,
//           name: playlist.name.trimEnd(),
//         });
//       } catch (error) {
//         next(createError(500, "Error fetching playlists"));
//       }
//     }
//   }

//   res.json({ userPlaylists: playlistData });
// };

const changeUserPreference = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      return next(createError(401, "Unauthorized"));
    }

    const decodedToken = jwt.verify(token, SECRET_KEY);

    const userAccount = await User.findOne({ where: { id: decodedToken.id } });

    userAccount.preference =
      userAccount.preference === "flac" ? "opus" : "flac";
    await userAccount.save();

    res.sendStatus(204);
  } catch (error) {
    return next(createError(500, "Changing user preference failed"));
  }
};

export {
  signup,
  signin,
  checkUserAccount,
  get,
  //   getPlaylists,
  changeUserPreference,
};

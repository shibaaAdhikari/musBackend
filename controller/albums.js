import fs from "fs";
import path from "path";
import md5 from "md5";
import Album from "../models/album.js";
import Song from "../models/song.js";

const create = async (req, res, next) => {
  try {
    const { title, type, artist, year, songs } = JSON.parse(req.body.albumData);
    console.log("Received album data:", title, type, artist, year, songs);

    // ... Your existing code ...
    let songArray;
    console.log("songArray:", songArray);
    // ... Your existing code ...

    try {
      songArray = songs;
    } catch (error) {
      return res
        .status(500)
        .json({ error: `Problem parsing song JSON: ${error.message}` });
    }

    const newAlbum = await Album.create({
      title,
      type,
      songs: [], // Empty array since we'll add song IDs later
      artist,
      coverArt: req.files.coverImage[0].path,
      year,
    });

    let albumSongs = [];
    console.log(req.files);

    // create entry for all songs in the album
    for (let i = 0; i < songArray.length; i++) {
      let songMd5;
      try {
        const buf = fs.readFileSync(req.files.songFiles[i].path);
        songMd5 = md5(buf);
      } catch (error) {
        return res
          .status(500)
          .json({ error: `Error reading song file: ${error.message}` });
      }

      const directoryPath = path.dirname(req.files.songFiles[i].path);
      const extensionName = path.extname(req.files.songFiles[i].path);
      const pathBaseName = path.basename(
        req.files.songFiles[i].path,
        extensionName
      );

      try {
        const newSong = await Song.create({
          title: songArray[i].title,
          artist: artist,
          featuredArtist: [songArray[i].featuredArtist],
          genre: [songArray[i].genre],
          album: newAlbum.id,
          hash: songMd5,
          filePath: req.files.songFiles[i].path,
          directoryPath, // Include directoryPath
          extensionName, // Include extensionName
          pathBaseName, // Include pathBaseName
        });
        console.log(newSong);
        albumSongs.push(newSong.id);
      } catch (error) {
        console.log(error);
        return res
          .status(500)
          .json({ error: `Error creating song: ${error.message}` });
      }
    }

    // update new album with newly entered songs
    await Album.update(
      {
        songs: albumSongs,
      },
      {
        where: {
          id: newAlbum.id,
        },
      }
    );

    res.json({ albumId: newAlbum.id });
    // console.log(albumId);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
// Assuming you have imported necessary modules and defined your models (Album and Song) here.

const getAlbumById = async (req, res) => {
  console.log(req);
  const albumId = req.params.albumid;
  console.log(req.file);
  try {
    const album = await Album.findOne({ where: { id: albumId } });

    if (!album) {
      return res
        .status(404)
        .json({ error: "No album found for the given album ID" });
    }

    const songsArray = [];
    for (const songId of album.songs) {
      try {
        const song = await Song.findOne({
          where: {
            id: songId,
          },
        });
        songsArray.push({
          songId: songId,
          filePath: song.toJSON().filePath,
          songTitle: song.title.trimEnd(),
        });
      } catch (error) {
        return res.status(500).json({ error: "Album fetch failed" });
      }
    }

    const responseData = {
      id: album.id,
      title: album.title.trimEnd(),
      songs: songsArray,
      type: album.type.trimEnd(),
      artistId: album.artist.trimEnd(),
      coverImage: album.coverArt.trimEnd(),
      year: album.year,
    };

    res.json(responseData);
  } catch (error) {
    return res
      .status(500)
      .json({ error: `Album fetch failed: ${error.message}` });
  }
};

const getAllAlbums = async (req, res) => {
  try {
    const albums = await Album.findAll();
    console

    const albumsArray = await Promise.all(
      albums.map(async (album) => {
        const songsArray = [];
        for (const songId of album.songs) {
          try {
            const song = await Song.findOne({
              where: {
                id: songId,
              },
            });
            songsArray.push({
              songId: songId,
              filePath: song.toJSON().filePath,
              songTitle: song.title.trimEnd(),
            });
          } catch (error) {
            console.log(error);
          }
        }
        return {
          id: album.id,
          title: album.title.trimEnd(),
          songs: songsArray,
          type: album.type.trimEnd(),
          artistId: album.artist.trimEnd(),
          coverImage: album.coverArt.trimEnd(),
          year: album.year,
        };
      })
    );

    res.json(albumsArray);
  } catch (error) {
    return res
      .status(500)
      .json({ error: `Album fetch failed: ${error.message}` });
  }
};

export { create, getAlbumById, getAllAlbums };

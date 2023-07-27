  import fs from "fs";
  import path from "path";
  import md5 from "md5";
  import Album from "../models/album.js";
  import Song from "../models/song.js";

  const create = async (req, res, next) => {
    try {
      // Remove the validationCheck function call
      const { title, songs, type, artist, year } = req.body;

      let songArray;
      try {
        let jsonSongs = JSON.parse(songs);
        console.log(songs);
        songArray = jsonSongs.songs;
      } catch (error) {
        return res
          .status(500)
          .json({ error: `Problem parsing song JSON: ${error.message}` });
      }

      if (!Array.isArray(songArray) || songArray.length === 0) {
        return res.status(500).json({ error: "Empty album" });
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
            featuredArtist: songArray[i].featuredArtist,
            genre: songArray[i].genre,
            album: newAlbum.id,
            hash: songMd5,
            filePath: req.files.songFiles[i].path,
            directoryPath, // Include directoryPath
            extensionName, // Include extensionName
            pathBaseName, // Include pathBaseName
          });
          albumSongs.push(newSong.id);
        } catch (error) {
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
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  };

  export { create };

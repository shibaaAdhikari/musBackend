import Song from "../models/song.js"; // Import your Song model
import PlayCount from "../models/playcount.js"; // Import your PlayCount model

// Function to calculate total play counts for each song
const calculateTotalPlayCounts = async () => {
  const songs = await Song.findAll(); // Fetch all songs
  const playCounts = {};

  for (const song of songs) {
    // Fetch play count for each song and calculate the total play count
    const playCountRecord = await PlayCount.findOne({ where: { songId: song.id } });

    if (playCountRecord) {
      playCounts[song.id] = playCountRecord.count;
    } else {
      playCounts[song.id] = 0;
    }
  }

  return playCounts;
};

// Merge sort implementation to sort in descending order
const mergeSort = (arr) => {
  if (arr.length <= 1) {
    return arr;
  }

  const middle = Math.floor(arr.length / 2);
  const left = arr.slice(0, middle);
  const right = arr.slice(middle);

  return merge(mergeSort(left), mergeSort(right), (a, b) => b.totalPlayCount - a.totalPlayCount);
};

const merge = (left, right, compare) => {
  let result = [];
  let leftIndex = 0;
  let rightIndex = 0;

  while (leftIndex < left.length || rightIndex < right.length) {
    if (leftIndex === left.length) {
      result.push(right[rightIndex]);
      rightIndex++;
    } else if (rightIndex === right.length) {
      result.push(left[leftIndex]);
      leftIndex++;
    } else if (compare(left[leftIndex], right[rightIndex]) > 0) {
      result.push(left[leftIndex]);
      leftIndex++;
    } else {
      result.push(right[rightIndex]);
      rightIndex++;
    }
  }

  return result;
};


// Controller to increment the play count for a song
const incrementPlayCount = async (req, res) => {
  const { songId } = req.params;

  try {
    // Check if a play count record exists for the song in the PlayCount model
    let playCountRecord = await PlayCount.findOne({ where: { songId } });

    if (!playCountRecord) {
      // If a play count record doesn't exist, create a new one
      playCountRecord = await PlayCount.create({ songId, count: 0 });
    }

    // Increment the play count in the PlayCount model
    playCountRecord.count += 1;
    await playCountRecord.save();

    res.status(200).json({ message: "Play count incremented", playCount: playCountRecord.count });
  } catch (error) {
    console.error(`Error updating play count: ${error.message}`);
    res.status(500).json({ error: `Error updating play count: ${error.message}` });
  }
};

const getTrendingSongs = async (req, res) => {
  try {
    const playCounts = await calculateTotalPlayCounts(); // Calculate total play counts
    const songs = await Song.findAll(); // Fetch all songs

    // Create an array of songs with their total play counts
    const songsWithPlayCounts = songs.map((song) => ({
      ...song.toJSON(),
      totalPlayCount: playCounts[song.id] || 0,
    }));

    // Sort songs using merge sort based on total play counts in descending order
    const sortedSongs = mergeSort(songsWithPlayCounts, (a, b) => b.totalPlayCount - a.totalPlayCount);

    // Extract necessary song information for frontend
    const trendingSongs = sortedSongs.map((song) => ({
      songId: song.id,
      filePath: song.filePath,
      songTitle: song.title.trimEnd(),
      artistId: song.artist.trimEnd(),
      totalPlayCount: song.totalPlayCount,
    }));

    res.json(trendingSongs);
  } catch (error) {
    console.error(`Error fetching and sorting trending songs: ${error.message}`);
    return res.status(500).json({ error: `Error fetching and sorting trending songs: ${error.message}` });
  }
};




export { calculateTotalPlayCounts, getTrendingSongs, incrementPlayCount};



import multer from "multer";

const SONG_MIME_TYPE_MAP = {
  "audio/flac": "flac",
  "audio/mp3": "mp3",
  "audio/wave": "wav",
  "audio/wav": "wav",
  "audio/x-wav": "wav",
  "audio/x-pn-wav": "wav",
};

const IMAGE_MIME_TYPE_MAP = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

// Set the storage engine for image and audio files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, "uploads/images/");
    } else if (file.mimetype.startsWith("audio/")) {
      cb(null, "uploads/audio/");
    } else {
      cb(new Error("Invalid file type."));
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = getExtensionByMimeType(file.mimetype);
    cb(null, `file_${uniqueSuffix}.${extension}`);
  },
});

// Function to get file extension based on MIME type
const getExtensionByMimeType = (mimeType) => {
  if (mimeType.startsWith("image/")) {
    return IMAGE_MIME_TYPE_MAP[mimeType] || "jpg"; // Default to 'jpg' if MIME type is unknown
  } else if (mimeType.startsWith("audio/")) {
    return SONG_MIME_TYPE_MAP[mimeType] || "mp3"; // Default to 'mp3' if MIME type is unknown
  } else {
    throw new Error("Invalid file type.");
  }
};

const upload = multer({ storage });

export default upload;

import multer from "multer";

const storage = multer.memoryStorage();
export const singleUpload = multer({storage}).single("file");

// Add a new middleware for profile updates that accepts both resume and profilePhoto
export const profileUpload = multer({storage}).fields([
  { name: 'resume', maxCount: 1 },
  { name: 'profilePhoto', maxCount: 1 }
]);
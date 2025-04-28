import multer from "multer";
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { filesize: 5 * 1024 * 1920 },
});

//creating middleware for image upload
export const uploadProfileImages = upload.fields([
  {
    name: "coverImage",
    maxCount: 1,
  },
  { name: "profileImage", maxCount: 1 },
]);

const Router = require("express");
const router = new Router();
const authMiddleware = require("../middleware/auth.middleware");
const FileController = require("../controllers/fileController");
const { check } = require("express-validator");

router.post("/upload", authMiddleware, FileController.uploadFile);
router.post(
  "",
  [
    authMiddleware,
    check("name", "Name must be at least 1 symbol length").isLength({ min: 1 }),
  ],
  FileController.createDir
);
router.get("", authMiddleware, FileController.getFiles);
router.get("/download", authMiddleware, FileController.downloadFile);
router.get("/search", authMiddleware, FileController.searchFile);
router.delete("/", authMiddleware, FileController.deleteFile);

module.exports = router;

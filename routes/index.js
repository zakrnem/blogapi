import express from "express";
const router = express.Router();

router.get("/", function (req, res) {
  res.sendStatus(403);
});

export default router;

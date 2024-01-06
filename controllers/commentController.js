import { asyncHandler } from "express-async-handler";
import { Post } from "../models/post";
import { Comment } from "../models/comment";
import { mongoose } from "mongoose";

export const comment_get = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  res.json(comment);
});

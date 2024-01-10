import asyncHandler from "express-async-handler";
import Post from "../models/post";
import Comment from "../models/comment";
import User from "../models/user"
import { mongoose } from "mongoose";

const format_comments = async function (comments) {
  for (const key of Object.keys(comments)) {
    const author = await User.findById(comments[key].user._id).exec()

    comments[key] = {
      author: author.fullname,
      message: comments[key].message,
      createdAt: comments[key].createdAt,
    }
  }
  return comments
}

const comment_get = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  res.json(comment);
});

export default {
  comment_get,
  format_comments,
}
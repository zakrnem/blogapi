import asyncHandler from "express-async-handler";
import Post from "../models/post";
import Comment from "../models/comment";
import User from "../models/user";
import { mongoose } from "mongoose";

const comment_get = asyncHandler(async (req, res) => {
  let comment = await Comment.findById(req.params.id);
  const author = await User.findById(comment.user._id).exec();

  comment = {
    _id: comment._id,
    author: author.fullname,
    user: comment.user,
    post: comment.post,
    message: comment.message,
    createdAt: comment.createdAt,
  };

  res.status(200).json(comment);
});

const comment_post = asyncHandler(async (req, res) => {
  const newComment = new Comment({
    user: req.session.userId,
    post: req.params.id,
    message: req.body.message,
  });

  await newComment.save();
  res.status(200).json(newComment);
});

// Add method for clients to reply a comment

// CLIENT methods

const format_comments = async function (comments) {
  for (const key of Object.keys(comments)) {
    const author = await User.findById(comments[key].user._id).exec();

    comments[key] = {
      author: author.fullname,
      message: comments[key].message,
      createdAt: comments[key].createdAt,
    };
  }
  return comments;
};

// ADMIN methods

const admin_comments = async function (comments) {
  for (const key of Object.keys(comments)) {
    const author = await User.findById(comments[key].user._id).exec();
    const url = "/api/admin" + comments[key].url;

    comments[key] = {
      _id: comments[key]._id,
      author: author.fullname,
      user: comments[key].user,
      post: comments[key].post,
      message: comments[key].message,
      createdAt: comments[key].createdAt,
      url,
    };
  }
  return comments;
};

export default {
  comment_get,
  comment_post,
  format_comments,
  admin_comments,
};

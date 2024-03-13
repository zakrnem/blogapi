import asyncHandler from "express-async-handler";
import Post from "../models/post";
import Comment from "../models/comment";
import User from "../models/user";
import { mongoose } from "mongoose";
import { format } from "date-fns";

// CLIENT methods

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

const comment_reply_post = asyncHandler(async (req, res) => {
  const parentComment = await Comment.findById(req.params.id);

  const newComment = new Comment({
    user: req.session.userId,
    post: parentComment.post,
    message: req.body.message,
    parent: req.params.id,
  });

  await newComment.save();
  res.status(200).json(newComment);
});

const user_get = asyncHandler(async (req, res) => {
  try {
    const comments = await Comment.find({ user: req.params.id });
    const formattedComments = await format_comments(comments, true);
    res.status(200).json(formattedComments);
  } catch (error) {
    throw new Error(error);
  }
});

const format_comments = async function (comments, getPost) {
  let post = "";
  for (const key of Object.keys(comments)) {
    const author = await User.findById(comments[key].user._id).exec();
    const parsedDate = new Date(comments[key].createdAt);
    const date = format(parsedDate, "MM-dd-yyyy");

    if (getPost) {
      post = await Post.findById(comments[key].post._id).exec();
    }
    comments[key] = {
      author: author.fullname,
      message: comments[key].message,
      createdAt: date,
      url: "/api/client" + comments[key].url,
      post,
    };
  }
  return comments;
};

// ADMIN methods

const admin_comments = async function (comments) {
  for (const key of Object.keys(comments)) {
    const author = await User.findById(comments[key].user._id).exec();
    const url = "/api/admin" + comments[key].url;
    const parsedDate = new Date(comments[key].createdAt);
    const date = format(parsedDate, "MM-dd-yyyy");

    comments[key] = {
      _id: comments[key]._id,
      author: author.fullname,
      user: comments[key].user,
      post: comments[key].post,
      message: comments[key].message,
      createdAt: date,
      url,
    };
  }
  return comments;
};

const comment_delete = asyncHandler(async (req, res) => {
  const deletedComment = await Comment.findByIdAndDelete(req.params.id);
  if (deletedComment) {
    res.status(200).json({ message: `Deleted post with Id: ${req.params.id}` });
  } else {
    res
      .status(404)
      .json({ message: `No comment with Id: ${req.params.id} exists.` });
  }
});

const get_comments = asyncHandler(async (req, res) => {
  const comments = await Comment.find().sort({ createdAt: -1 });

  let resObj = [];

  for (const key in comments) {
    const author = await User.findById(comments[key].user).exec();
    const post = await Post.findById(comments[key].post).exec();
    const parsedDate = new Date(comments[key].createdAt);
    const date = format(parsedDate, "MM-dd-yyyy");
    const commentUrl = "/comments/" + comments[key]._id

    resObj.push({
      author: author.fullname,
      post: post.title,
      date,
      message: comments[key].message,
      postUrl: post.url,
      commentUrl,
    });
  }
  res.status(200).json(resObj);
});

export default {
  comment_get,
  comment_post,
  comment_reply_post,
  format_comments,
  admin_comments,
  comment_delete,
  user_get,
  get_comments,
};

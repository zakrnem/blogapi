import asyncHandler from "express-async-handler";
import Post from "../models/post";
import Comment from "../models/comment";
import { mongoose } from "mongoose";
import comment_controller from "./commentController";

function buildSummary(string, sentencesCount) {
  const arr = string.match(/[^.!?]+[.!?]+/g);
  let summary = "";

  if (arr !== null && arr.length < sentencesCount) {
    for (let i = 0; i < sentencesCount; i++) {
      if (i === 0) {
        summary += arr[i];
      } else {
        summary += " " + arr[i];
      }
    }
  } else {
    summary = string;
  }

  return summary;
}

// CLIENT methods

async function formatPosts(posts) {
  for (const key of Object.keys(posts)) {
    const comments = await Comment.find({ post: posts[key]._id }).exec();
    let commentsNumber = 0;
    if (comments.length > 0) {
      commentsNumber = comments.length;
    }
    let summary = buildSummary(posts[key].content, 3);
    let url = "/client" + posts[key].url;
    posts[key] = {
      title: posts[key].title,
      summary,
      date: posts[key].createdAt,
      visible: posts[key].visible,
      commentsNumber,
      url,
    };
  }
  return posts;
}

const client_post_get = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  try {
    let comments = await Comment.find({ post: post._id }).exec();
    comments = await comment_controller.format_comments(comments);

    let postObj = post.toObject();
    postObj = { ...postObj, comments: comments };
    res.status(200).json(postObj);
  } catch {
    res
      .status(404)
      .json({ message: `No post with Id: ${req.params.id} exists.` });
  }
});

const client_posts_get = asyncHandler(async (req, res) => {
  let posts = await Post.find().sort({ createdAt: -1 }).limit(3).exec();
  posts = await formatPosts(posts);

  res.status(200).json(posts);
});

const post_page_get = asyncHandler(async (req, res) => {
  let N = req.params.id * 3 - 3;
  let posts = await Post.find().sort({ createdAt: -1 }).limit(3).skip(N).exec();
  posts = await formatPosts(posts);

  if (posts.length > 0) {
    res.status(200).json(posts);
  } else {
    res.status(404).json({ message: "There are no more posts." });
  }
});

// ADMIN methods

async function adminFormat(posts) {
  for (const key of Object.keys(posts)) {
    let comments = await Comment.find({ post: posts[key]._id }).exec();
    comments = await comment_controller.admin_comments(comments);
    let summary = buildSummary(posts[key].content, 3);
    let url = "/admin" + posts[key].url;
    posts[key] = {
      _id: posts[key]._id,
      user: posts[key].user,
      visible: posts[key].visible,
      createdAt: posts[key].createdAt,
      title: posts[key].title,
      summary,
      comments,
      url,
    };
  }
  return posts;
}

const admin_posts_get = asyncHandler(async (req, res) => {
  let posts = await Post.find().sort({ createdAt: -1 }).limit(3).exec();
  posts = await adminFormat(posts);

  res.status(200).json(posts);
});

const create_post = asyncHandler(async (req, res) => {
  const existingPost = await Post.find({ title: req.body.title });
  const newPost = new Post({
    user: req.body.user,
    title: req.body.title,
    content: req.body.content,
    visible: req.body.visible,
  });

  if (existingPost.length > 0) {
    res.status(400).json({
      message:
        "There's another post with the same name, please change the name.",
    });
  } else {
    await newPost.save();
    res.status(201).json(newPost);
  }
});

const admin_post_get = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  try {
    let comments = await Comment.find({ post: post._id }).exec();
    comments = await comment_controller.admin_comments(comments);
    let postObj = post.toObject();
    postObj = { ...postObj, comments: comments };
    res.status(200).json(postObj);
  } catch (err) {
    res
      .status(404)
      .json({ message: `No post with Id: ${req.params.id} exists.` });
  }
});

const admin_posts_page = asyncHandler(async (req, res) => {
  let N = req.params.id * 3 - 3;
  let posts = await Post.find().sort({ createdAt: -1 }).limit(3).skip(N).exec();
  posts = await adminFormat(posts);

  if (posts.length > 0) {
    res.status(200).json(posts);
  } else {
    res.status(404).json({ message: "There are no more posts." });
  }
});

const post_update = asyncHandler(async (req, res) => {
  const updatedPost = new Post({
    user: req.body.user,
    title: req.body.title,
    content: req.body.content,
    visible: req.body.visible,
    _id: req.params.id,
  });
  const updatePost = await Post.findByIdAndUpdate(
    req.params.id,
    updatedPost,
    {},
  );
  if (updatePost) {
    res.status(200).json(updatedPost);
  } else {
    res
      .status(404)
      .json({ message: `No post with Id: ${req.params.id} exists.` });
  }
});

const post_delete = asyncHandler(async (req, res) => {
  const deletedPost = await Post.findByIdAndDelete(req.params.id);
  if (deletedPost) {
    res.status(200).json({ message: `Deleted post with Id: ${req.params.id}` });
  } else {
    res
      .status(404)
      .json({ message: `No post with Id: ${req.params.id} exists.` });
  }
});

export default {
  client_posts_get,
  client_post_get,
  post_page_get,
  create_post,
  admin_posts_get,
  admin_post_get,
  admin_posts_page,
  post_update,
  post_delete,
};

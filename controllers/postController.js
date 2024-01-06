import asyncHandler from "express-async-handler";
import Post from "../models/post";
import Comment from "../models/comment";
import { mongoose } from "mongoose";

async function formatPosts(posts) {
  for (const key of Object.keys(posts)) {
    const comments = await Comment.findById(posts[key]._id);
    const commentsNumber = Object.keys(comments).length;
    posts[key] = {
      title: posts[key].title,
      summary: posts[key].summary,
      date: posts[key].createdAt,
      visible: posts[key].visible,
      commentsNumber,
    };
  }
}

const post_get = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  res.json(post);
});

const post_page_get = asyncHandler(async (req, res) => {
  let N = req.params.id * 5 - 5;
  const posts = await Post.find().limit(5).skip(N).exec();
  formatPosts(posts);

  res.json(posts);
});

const formatted_post_get = asyncHandler(async (req, res) => {
  const posts = await Post.find().limit(5).exec();
  formatPosts(posts);

  res.json(posts);
});

export {
    formatted_post_get,
    post_get,
    post_page_get,
}

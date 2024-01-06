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

const formatted_post_get = asyncHandler(async (req, res, next) => {
    const posts = await Post.find().limit(5).exec();
    formatPosts(posts);
  
    res.json(posts);
  });

export default formatted_post_get
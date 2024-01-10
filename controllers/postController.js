import asyncHandler from "express-async-handler";
import Post from "../models/post";
import Comment from "../models/comment";
import { mongoose } from "mongoose";
import comment_controller from "./commentController"

function buildSummary(string, sentencesCount) {
  const arr = string.match(/[^.!?]+[.!?]+/g);
  let summary = "";

  for (let i = 0; i < sentencesCount; i++) {
    if (i === 0) {
      summary += arr[i];
    } else {
      summary += " " + arr[i];
    }
  }
  return summary
}

async function formatPosts(posts) {
  for (const key of Object.keys(posts)) {
    const comments = await Comment.find({ post: posts[key]._id }).exec();
    let commentsNumber = 0;
    if (comments.length > 0) {
      commentsNumber = comments.length;
    }
    let summary = buildSummary(posts[key].content, 3)
    let url = "/client" + posts[key].url
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

const post_get = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  let comments = await Comment.find({ post: post._id }).exec();
  comments = await comment_controller.format_comments(comments)

  let postObj = post.toObject()
  postObj = {...postObj, comments: comments}

  res.json(postObj);
});

const post_page_get = asyncHandler(async (req, res) => {
  let N = req.params.id * 3 - 3;
  let posts = await Post.find().limit(3).skip(N).exec();
  posts = await formatPosts(posts);

  res.json(posts);
});

const formatted_post_get = asyncHandler(async (req, res) => {
  let posts = await Post.find().limit(3).exec();
  posts = await formatPosts(posts);

  res.json(posts);
});

export default {
  formatted_post_get,
  post_get,
  post_page_get,
};

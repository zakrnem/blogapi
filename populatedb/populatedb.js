#! /usr/bin/env node

console.log(
  'This script populates some test posts, comments and users to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.mongodb.net/local?retryWrites=true&w=majority"',
);

const userArgs = process.argv.slice(2);

import User from "../models/user";
import Post from "../models/post";
import Comment from "../models/comment";
import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
mongoose.set("strictQuery", false);

const mongoDB = `mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWORD}@${process.env.URL}`;

const users = [];
const posts = [];
const comments = [];
import populatePasswords from "./populatePasswords";
import populatePosts from "./populatePosts";
import populateComments from "./populateComments";

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createUsers();
  await createPosts();
  await createComments();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

async function userCreate(
  index,
  first_name,
  last_name,
  username,
  password,
  admin,
) {
  const newUser = {
    first_name,
    last_name,
    username,
    password,
    admin,
  };
  if (admin === undefined) admin = false;
  const user = new User(newUser);

  await user.save();
  users[index] = user;
  console.log(`Added user: ${first_name} ${last_name}`);
}

async function createUsers() {
  console.log("Adding users");
  await Promise.all([
    userCreate(0, "John", "Winston", "jwinston", populatePasswords[0]),
    userCreate(1, "Donald", "Smith", "dsmith", populatePasswords[1]),
    userCreate(2, "Mia", "Cyrus", "mycyrus", populatePasswords[2]),
    userCreate(3, "Lea", "Talerico", "ltalerico", populatePasswords[3]),
    userCreate(4, "Shannon", "Lee", "shanlee", populatePasswords[4], true),
    userCreate(5, "Davis", "Mann", "dmann", populatePasswords[5], true),
  ]);
}

async function postCreate(index, user, title, content, visible) {
  const newPost = {
    user,
    title,
    content,
    visible,
  };
  if (visible === undefined) visible = false;

  const post = new Post(newPost);
  posts[index] = post;
  await post.save();
  console.log(`Added post: ${title} from ${user} with ID: ${post._id}`);
}

async function createPosts() {
  console.log("Adding posts");
  await Promise.all([
    postCreate(
      0,
      users[4],
      populatePosts[0].title,
      populatePosts[0].content,
      true,
    ),
    postCreate(
      1,
      users[4],
      populatePosts[1].title,
      populatePosts[1].content,
      true,
    ),
    postCreate(
      2,
      users[5],
      populatePosts[2].title,
      populatePosts[2].content,
      true,
    ),
    postCreate(
      3,
      users[5],
      populatePosts[3].title,
      populatePosts[3].content,
      true,
    ),
    postCreate(4, users[5], populatePosts[4].title, populatePosts[4].content),
  ]);
}

async function commentCreate(index, user, post, message) {
  const newComment = {
    user,
    post,
    message,
  };

  const comment = new Comment(newComment);
  comments[index] = comment;
  await comment.save();
  console.log(`Added comment on ${post} by ${user} with ID: ${comment._id}`);
}

async function createComments() {
  console.log("Adding comments");
  await Promise.all([
    commentCreate(0, users[0], posts[0], populateComments[0]),
    commentCreate(1, users[0], posts[1], populateComments[1]),
    commentCreate(2, users[2], posts[2], populateComments[2]),
    commentCreate(3, users[1], posts[3], populateComments[3]),
    commentCreate(4, users[3], posts[1], populateComments[4]),
    commentCreate(5, users[3], posts[0], populateComments[5]),
  ]);
}

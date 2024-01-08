#! /usr/bin/env node

console.log(
  'This script populates some test posts, comments and users to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.mongodb.net/local?retryWrites=true&w=majority"',
);

const userArgs = process.argv.slice(2);

import User from "./models/user";
import Post from "./models/post";
import Comment from "./models/comment";
import dotenv from "dotenv";
dotenv.config();

const users = [];
const messages = [];

import mongoose from "mongoose";
mongoose.set("strictQuery", false);

const mongoDB = `mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWORD}@${process.env.URL}`;

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
/*   await createGenres();
  await createAuthors();
  await createBooks();
  await createBookInstances(); */
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

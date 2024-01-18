import express from "express";
const router = express.Router();
import asyncHandler from "express-async-handler";
import User from "../models/user";
import bcrypt from "bcryptjs"

// Example login route
const login = asyncHandler(async (req, res) => {
  const user = await User.findOne({ username: req.body.username });

  if (user) {
    const match = await bcrypt.compare(req.body.password, user.password);
    if (match) {
        res.status(200).json({message: `Succesfully logged in ${user.fullname}`})
    } else {
        res.status(400).json({message: "Password is wrong"})
    }
  } else {
    res.status(400).json({message: "Username is wrong"})
  }
  const userId = 123; // Replace with your actual user ID

  req.session.userId = userId;
  res.send("Login successful");
});

// Example route to check if the user is authenticated
const check_auth = asyncHandler(async (req, res) => {
  const isAuthenticated = !!req.session.userId;
  res.json({ isAuthenticated });
});

export default {
  login,
  check_auth,
};

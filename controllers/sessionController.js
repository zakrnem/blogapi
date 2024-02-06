import express from "express";
const router = express.Router();
import asyncHandler from "express-async-handler";
import User from "../models/user";
import bcrypt from "bcryptjs";

const login = asyncHandler(async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  if (user) {
    const match = await bcrypt.compare(req.body.password, user.password);
    if (match) {
      req.session.userId = user._id;
      res.cookie("session-cookie", req.sessionID, {
        secure: process.env.NODE_ENV === "production",
        httpOnly: false,
        maxAge: 1 * 60 * 1000,
      });
      res
        .status(200)
        .json({ message: `Succesfully logged in ${user.fullname}` });
    } else {
      res.status(400).json({ message: "Password is wrong" });
    }
  } else {
    res.status(400).json({ message: "Username is wrong" });
  }
});

const logout = asyncHandler(async (req, res) => {
  if (!!req.session.userId) {
    req.session.destroy();
    res.clearCookie("session-cookie");
    res.status(200).send("Logout successful");
  }
});

const check_auth = asyncHandler(async (req, res) => {
  const isAuthenticated = !!req.session.userId;
  res.status(200).json(isAuthenticated);
});

const isAuthenticated = (req, res, next) => {
  if (req.session.userId) {
    next();
  } else {
    res.status(401).send("Unauthorized, please log in.");
  }
};

export default {
  login,
  logout,
  check_auth,
  isAuthenticated,
};

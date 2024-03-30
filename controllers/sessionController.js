import asyncHandler from "express-async-handler";
import User from "../models/user";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import user from "../models/user";
dotenv.config();

const signup = asyncHandler(async (req, res) => {
  const password = bcrypt.hashSync(req.body.password, process.env.SALT);
  const newUser = new User({
    first_name: req.body.firstName,
    last_name: req.body.lastName,
    username: req.body.username,
    password,
  });
  try {
    await newUser.save();
    res.status(200).json(newUser);
  } catch (error) {
    throw new Error(error);
  }
});

const login = asyncHandler(async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  if (user) {
    const match = await bcrypt.compare(req.body.password, user.password);
    if (match) {
      req.session.userId = user._id;
      res.cookie("session-cookie", req.sessionID, {
        secure: process.env.NODE_ENV === "production",
        httpOnly: false,
        maxAge: 30 * 60 * 1000,
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

const adminLogin = asyncHandler(async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  if (user) {
    if (user.admin) {
      const match = await bcrypt.compare(req.body.password, user.password);
      if (match) {
        req.session.userId = user._id;
        res.cookie("session-cookie", req.sessionID, {
          secure: process.env.NODE_ENV === "production",
          httpOnly: false,
          maxAge: 30 * 60 * 1000,
        });
        res
          .status(200)
          .json({ message: `Succesfully logged in ${user.fullname}` });
      } else {
        res.status(400).json({ message: "Password is wrong" });
      }
    } else {
      res.status(400).json({ message: "User is not admin" });
    }
  } else {
    res.status(400).json({ message: "Username is wrong" });
  }
});

const logout = asyncHandler(async (req, res) => {
  if (!!req.session.userId) {
    req.session.destroy();
    res.clearCookie("session-cookie");
    res.status(200).send({ message: "Logout successful" });
  }
});

const check_auth = asyncHandler(async (req, res) => {
  const isAuthenticated = !!req.session.userId;
  res.status(200).json(isAuthenticated);
});

const check_admin_auth = asyncHandler(async (req, res) => {
  const user = await User.findById(req.session.userId);
  const isAuthenticated = !!req.session.userId && user.admin;
  res.status(200).json(isAuthenticated);
});

const is_authenticated = (req, res, next) => {
  if (req.session.userId) {
    next();
  } else {
    res.status(401).send("Unauthorized, please log in.");
  }
};

const admin_auth = asyncHandler(async (req, res, next) => {
  if (req.session.userId) {
    const user = await User.findById(req.session.userId);
    if (user.admin) {
      next();
    } else {
      res.status(401).send("User is not admin");
    }
  } else {
    res.status(401).send("Unauthorized, please log in.");
  }
});

const get_user = asyncHandler(async (req, res) => {
  const userId = req.session.userId;
  if (userId) {
    const user = await User.findById(userId).exec();
    const fullname = user.fullname;
    res.status(200).send({ fullname, userId });
  } else {
    res.status(401).send("Unauthorized, please log in.");
  }
});

export default {
  signup,
  login,
  adminLogin,
  logout,
  check_auth,
  check_admin_auth,
  is_authenticated,
  admin_auth,
  get_user,
};

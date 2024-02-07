import createError from "http-errors";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import clientRouter from "./routes/client";
import adminRouter from "./routes/admin";
import dotenv from "dotenv";
dotenv.config();
import debug from "debug";
import session from "express-session";
import cors from "cors"

// Setup mongoDB connection
import mongoose from "mongoose";
mongoose.set("strictQuery", false);

const mongoDB = `mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWORD}@${process.env.URL}`;

main().catch((err) => debug(err));
async function main() {
  await mongoose.connect(mongoDB);
  debug("Connected to MongoDB Atlas");
}

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));


const corsOptions = {
  origin: process.env.FRONT_END_URL,
  credentials: true,
};

app.use(cors(corsOptions));

const secret = process.env.SESSION_SECRET;
app.use(
  session({
    secret: secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      name: "session-cookie",
      secure: process.env.NODE_ENV === "production",
      maxAge: 1 * 60 * 1000,
    },
  }),
);

app.use("/api/client", clientRouter);
app.use("/api/admin", adminRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

export default app;

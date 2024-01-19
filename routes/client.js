import express from "express";
const router = express.Router();
import post_controller from "../controllers/postController";
import comment_controller from "../controllers/commentController";
import session_controller from "../controllers/sessionController";

router.get("/posts", post_controller.client_posts_get);

router.get("/posts/page/:id", post_controller.client_posts_page);

router.get("/posts/:id", post_controller.client_post_get);

router.post("/posts/:id", session_controller.isAuthenticated, comment_controller.comment_post);

router.get("/comments/:id", comment_controller.comment_get);

router.post("/login", session_controller.login);

router.post(
  "/logout",
  session_controller.isAuthenticated,
  session_controller.logout,
);

router.get("/is_auth", session_controller.check_auth);

export default router;

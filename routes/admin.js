import express from "express";
const router = express.Router();
import post_controller from "../controllers/postController";
import comment_controller from "../controllers/commentController";
import session_controller from "../controllers/sessionController";

router.get(
  "/posts",
  session_controller.admin_auth,
  post_controller.admin_posts_get,
);

router.post(
  "/posts",
  session_controller.admin_auth,
  post_controller.admin_create_post,
);

router.get(
  "/posts/page/:id",
  session_controller.admin_auth,
  post_controller.admin_posts_page,
);

router.get(
  "/posts/:id",
  session_controller.admin_auth,
  post_controller.admin_post_get,
);

router.put(
  "/posts/:id",
  session_controller.admin_auth,
  post_controller.admin_post_update,
);

router.delete(
  "/posts/:id",
  session_controller.admin_auth,
  post_controller.admin_post_delete,
);

router.get(
  "/comments/:id",
  session_controller.admin_auth,
  comment_controller.comment_get,
);

router.delete(
  "/comments/:id",
  session_controller.admin_auth,
  comment_controller.comment_delete,
);

router.get(
  "/comments",
  session_controller.admin_auth,
  comment_controller.get_comments,
);

router.post("/login", session_controller.adminLogin);

router.post(
  "/logout",
  session_controller.admin_auth,
  session_controller.logout,
);

router.get("/is_auth", session_controller.check_admin_auth);

router.post("/login", session_controller.login);

router.post("/signup", session_controller.signup);

router.get("/user", session_controller.get_user);

router.get("/user/:id", comment_controller.user_get);

export default router;

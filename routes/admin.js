import express from "express";
const router = express.Router();
import post_controller from "../controllers/postController";
import comment_controller from "../controllers/commentController";
import session_controller from "../controllers/sessionController";

router.get("/posts", session_controller.isAuthenticated, post_controller.admin_posts_get);

router.post("/posts", session_controller.isAuthenticated, post_controller.admin_create_post);

router.get("/posts/page/:id", session_controller.isAuthenticated, post_controller.admin_posts_page);

router.get("/posts/:id", session_controller.isAuthenticated, post_controller.admin_post_get);

router.put("/posts/:id", session_controller.isAuthenticated, post_controller.admin_post_update);

router.delete("/posts/:id", session_controller.isAuthenticated, post_controller.admin_post_delete);

router.get("/comments/:id", session_controller.isAuthenticated, comment_controller.comment_get);

router.post("/login", session_controller.login);

router.post("/logout", session_controller.isAuthenticated, session_controller.logout);

router.get("/is_auth", session_controller.check_auth);

export default router;

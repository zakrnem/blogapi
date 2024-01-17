import express from "express";
const router = express.Router();
import post_controller from "../controllers/postController";
import comment_controller from "../controllers/commentController";

router.get("/posts", post_controller.admin_posts_get);

router.post("/posts", post_controller.create_post);

router.get("/posts/page/:id", post_controller.admin_posts_page);

router.get("/posts/:id", post_controller.admin_post_get);

router.put("/posts/:id", post_controller.post_update);

router.delete("/posts/:id", post_controller.post_delete);

router.get("/comments/:id", comment_controller.comment_get);

export default router;

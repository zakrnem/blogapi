import express from "express";
const router = express.Router();
import post_controller from "../controllers/postController";
import comment_controller from "../controllers/commentController"

router.get("/posts", post_controller.formatted_post_get);

router.get("/posts/page/:id", post_controller.post_page_get);

router.get("/posts/:id", post_controller.post_get);

router.get("/comments/:id", comment_controller.comment_get)

export default router;

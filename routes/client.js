import express from "express";
const router = express.Router();
// import post_controller from "../controllers/postController";
import formattedPost from "../controllers/formattedPost";

router.get("/posts", formattedPost)

/* router.get("/posts", post_controller.formatted_post_get);

router.get("/posts/page/:id", post_controller.post_page_get);

router.get("/posts/:id", post_controller.post_get);

router.get("/comments/:id", (req, res) => res.json(`Not implemented yet. Comment ${req.params.id} GET`)); */

export default router
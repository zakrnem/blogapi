import mongoose from "mongoose";
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
  parent: { type: Schema.Types.ObjectId, ref: "Comment" },
  message: { type: String, required: true, minLength: 10, maxLength: 1000 },
  createdAt: { type: Date, default: Date.now },
});

commentSchema.virtual("url").get(function () {
  return `/comments/${this._id}`;
});

export default mongoose.model("Comment", commentSchema);

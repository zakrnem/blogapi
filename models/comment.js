import mongoose from "mongoose";
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  message: { type: String, required: true, minLength: 10, maxLength: 1000 },
  createdAt: { type: Date, default: Date.now },
});

mongoose.virtual("url").get(() => {
  return `/comments/${this._id}`;
});

export default mongoose.model("Comment", commentSchema);

import mongoose from "mongoose";
const Schema = mongoose.Schema;

const postSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true, minLength: 10, maxLength: 1000 },
  createdAt: { type: Date, default: Date.now },
  visible: { type: Boolean, default: false },
});

mongoose.virtual("url").get(() => {
  return `/posts/${this._id}`;
});

export default mongoose.model("Post", postSchema);

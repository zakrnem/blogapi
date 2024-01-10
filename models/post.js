import mongoose from "mongoose";
const Schema = mongoose.Schema;

const postSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true, minLength: 5, maxLength: 120 },
  content: { type: String, required: true, minLength: 10, maxLength: 1000 },
  createdAt: { type: Date, default: Date.now },
  visible: { type: Boolean, default: false },
});

postSchema.virtual("summary").get(function () {
  return `Split string at a paragraph end. ${this.content}`;
});

postSchema.virtual("url").get(function () {
  return `/posts/${this._id}`;
});

export default mongoose.model("Post", postSchema);

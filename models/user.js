import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema({
  first_name: { type: String, required: true, minLength: 2 },
  last_name: { type: String, required: true, minLength: 2 },
  username: { type: String, required: true, minLength: 5 },
  password: { type: String, required: true, minLength: 10 },
  createdAt: { type: Date, default: Date.now },
  admin: { type: Boolean, default: false },
});

mongoose.virtual("fullname").get(() => {
  return first_name + " " + last_name;
});

mongoose.virtual("url").get(() => {
  return `/users/${this._id}`;
});

export default mongoose.model("User", userSchema);

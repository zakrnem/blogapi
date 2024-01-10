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

userSchema.virtual("fullname").get(function () {
  return this.first_name + " " + this.last_name;
});

userSchema.virtual("url").get(function () {
  return `/users/${this._id}`;
});

export default mongoose.model("User", userSchema);

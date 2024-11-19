const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String },
  imageUrl: { type: String },
  email: { type: String },
  phoneNumber: { type: String },
  password: { type: String },
  permissions: [{ type: String }],
  resources: [{ type: mongoose.Types.ObjectId, ref: "Resource" }],
});

module.exports = mongoose.model("User", userSchema);

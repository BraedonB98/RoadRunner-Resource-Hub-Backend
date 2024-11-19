const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const resourceSchema = new Schema({
  title: { type: String },
  search: [{ type: String }],
  description: { type: String },
  link: { type: String },
  image: { type: String },
  creator: { type: mongoose.Types.ObjectId, ref: "User" },
  audience: [{ type: String }], // array to allow for multiple audiences
  users: [{ type: mongoose.Types.ObjectId, ref: "User" }],
});

module.exports = mongoose.model("resource", resourceSchema);

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const resourceSchema = new Schema({
  title: { type: String , required: true},
  tags: [{ type: String  }],
  description: { type: String , required: true},
  link: { type: String },
  image: { type: String , required: true},
  creator: { type: mongoose.Types.ObjectId, ref: "User" , required: true},
  audience: [{ type: String }], // array to allow for multiple audiences
  users: [{ type: mongoose.Types.ObjectId, ref: "User" }],
});

module.exports = mongoose.model("Resource", resourceSchema);

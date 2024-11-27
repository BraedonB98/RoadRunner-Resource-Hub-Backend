const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ExternalResourceSchema = new Schema({
  title: { type: String, required: true },
  tags: [{ type: String }],
  description: { type: String, required: true },
  link: { type: String },
  image: { type: String, required: true },
  creator: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  audience: [{ type: String }], // array to allow for multiple audiences
  users: [{ type: mongoose.Types.ObjectId, ref: "User" }],
  analytics: {
    resourceCreated: { type: Date, default: Date.now },
    lastModified: { type: Date, default: Date.now },
    status: {
      active: { type: Boolean, default: true },
      statusChangeDate: { type: Date, default: Date.now },
    },
  },
});

module.exports = mongoose.model("ExternalResource", ExternalResourceSchema);

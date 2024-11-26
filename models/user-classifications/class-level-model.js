const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const classLevelSchema = new Schema({ //example Freshman, Sophomore, Junior, Senior
  label: { type: String , required: true},
  requirements: { type: String }, //example 0-15 credits
  description: { type: String , required: true},
  analytics:{
    creator: { type: mongoose.Types.ObjectId, ref: "User" , required: true},
    createdOn: { type: Date , required: true},
    lastEditedOn: { type: Date , required: true},
    lastEditedBy: { type: mongoose.Types.ObjectId, ref: "User" , required: true},
  }
});

module.exports = mongoose.model("ClassLevel", classLevelSchema);
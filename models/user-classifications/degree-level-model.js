const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const degreeLevelSchema = new Schema({ //example Bachelor of Science
  label: { type: String , required: true},
  description: { type: String , required: true},
  degreePrograms: [{ type: mongoose.Types.ObjectId, ref: "DegreeProgram" }],
  analytics:{
    creator: { type: mongoose.Types.ObjectId, ref: "User" , required: true},
    createdOn: { type: Date , required: true},
    lastEditedOn: { type: Date , required: true},
    lastEditedBy: { type: mongoose.Types.ObjectId, ref: "User" , required: true},
  }
});

module.exports = mongoose.model("DegreeLevel", degreeLevelSchema);
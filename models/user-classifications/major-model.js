const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const resourceSchema = new Schema({
  label: { type: String , required: true},
  description: { type: String , required: true},
  websiteLink: { type: String },
  image: { type: String },
  department: {type: mongoose.Types.ObjectId, ref: "Department" , required: true},
  degreeLevels:[{type: mongoose.Types.ObjectId, ref: "DegreeLevel"}], //Associates, Bachelors, Masters, Doctorate
  academicRequirements: [{
    degreeLevel: { type: mongoose.Types.ObjectId, ref: "DegreeLevel" },
    credits: { type: Number },
    courses: [{ type: mongoose.Types.ObjectId, ref: "Course" }],
    electives: [{ type: mongoose.Types.ObjectId, ref: "Course" }],
    prerequisites: [{ type: mongoose.Types.ObjectId, ref: "Course" }],
    coreCourses: [{ type: mongoose.Types.ObjectId, ref: "Course" }],
   }],
  analytics:{
    creator: { type: mongoose.Types.ObjectId, ref: "User" , required: true},
    createdOn: { type: Date , required: true},
    lastEditedOn: { type: Date , required: true},
    lastEditedBy: { type: mongoose.Types.ObjectId, ref: "User" , required: true},
  }
});

module.exports = mongoose.model("resource", resourceSchema);
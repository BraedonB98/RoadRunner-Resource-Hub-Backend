const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const degreeProgramSchema = new Schema({
  label: { type: String , required: true},
  abbreviation: { type: String , required: true},//HCM, CS, ENG
  estimatedDuration: { type: Number , required: true},//2 years
  type: { type: String , required: true},//Major, Minor, Certificate
  description: { type: String , required: true},
  websiteLink: { type: String },
  image: { type: String },
  school: {type: mongoose.Types.ObjectId, ref: "School" , required: true},
  department: {type: mongoose.Types.ObjectId, ref: "Department" , required: true},
  degreeLevels:[{type: mongoose.Types.ObjectId, ref: "DegreeLevel"}], //Associates, Bachelors, Masters, Doctorate
  academicRequirements: [{
    degreeLevel: { type: mongoose.Types.ObjectId, ref: "DegreeLevel" },
    credits: { type: Number },
    courses: [{ type: mongoose.Types.ObjectId, ref: "Course" }],
    electives: [{ type: mongoose.Types.ObjectId, ref: "Course" }],
    prerequisites: [{ type: mongoose.Types.ObjectId, ref: "Course" }],
    coreCourses: [{ type: mongoose.Types.ObjectId, ref: "Course" }],
    SubDegreePrograms: [{ type: mongoose.Types.ObjectId, ref: "DegreeProgram" }],//ex if Computer Science Major REQUIRED a Math Minor
   }],
  analytics:{
    creator: { type: mongoose.Types.ObjectId, ref: "User" , required: true},
    createdOn: { type: Date , required: true},
    lastEditedOn: { type: Date , required: true},
    lastEditedBy: { type: mongoose.Types.ObjectId, ref: "User" , required: true},
  }
});

module.exports = mongoose.model("DegreeProgram", degreeProgramSchema);
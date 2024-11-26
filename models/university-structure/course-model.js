const { text } = require("body-parser");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const courseSchema = new Schema({ //example Bachelor of Science
  label: { type: String, required: true },
  courseCode: { type: String, required: true },
  description: { type: String, required: true },
  credits: [{ type: Number, required: true }], //if multiple, list all Example [1,2,3] for 1-3 credits
  departments: [{ type: mongoose.Types.ObjectId, ref: "Department" }],
  semester: { type: mongoose.Types.ObjectId, ref: "Semester" },
  year: { type: Number, required: true },
  type:{
    online: { type: Boolean },//true if online course
    async: { type: Boolean }//true if asynchronous
  },
  schedule: {
    days: [{ type: String }], //Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday
    time: { type: String }, //time of day
    classroom: { 
        building: { type: String },
        room: { type: String },
     },
  },
  requirements: {
    prerequisites: [{ type: mongoose.Types.ObjectId, ref: "Course" }],
    corequisites: [{ type: mongoose.Types.ObjectId, ref: "Course" }],
    school: { type: mongoose.Types.ObjectId, ref: "School" },
    classLevels: [{ type: mongoose.Types.ObjectId, ref: "ClassLevel" }],
    degreePrograms: [{ type: mongoose.Types.ObjectId, ref: "DegreeProgram" }],
    creditHours: [{ type: Number }],
  },
  courseParticipants: {
     instructors: [{ type: mongoose.Types.ObjectId, ref: "Faculty" }],
     teachingAssistants: [{ type: mongoose.Types.ObjectId, ref: "Faculty" }],
     students: [{ type: mongoose.Types.ObjectId, ref: "User" }],
  },
  resources:{
    syllabus: { type: String },
    textbooks: [{ type: String }],
    readings: [{ type: String }],
    websites: [{ type: String }],
    software: [{ type: String }],
  },

  analytics:{
    creator: { type: mongoose.Types.ObjectId, ref: "User" , required: true},
    createdOn: { type: Date , required: true},
    lastEditedOn: { type: Date , required: true},
    lastEditedBy: { type: mongoose.Types.ObjectId, ref: "User" , required: true},
  }
});

module.exports = mongoose.model("Course", courseSchema);
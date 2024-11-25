const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const { isEmail, isMobilePhone, isStrongPassword } = require('validator');

const studentSchema = new Schema({
  schoolStudentID: { type: String , required: true},
  birthdate: { type: Date , required: true},
  address: { type: String , required: true},
  permanentAddress: { type: String , required: true},
  alumni: { type: Boolean , required: true},
  advisors: [{ type: mongoose.Types.ObjectId, ref: "Staff" }],
  academicDetails: {
    majors: [{ type: mongoose.Types.ObjectId, ref: "Major" }],
    minors: [{ type: mongoose.Types.ObjectId, ref: "Minor" }],
    certificates: [{ type: mongoose.Types.ObjectId, ref: "Certificate" }],
    schools: [{ type: mongoose.Types.ObjectId, ref: "School" }],
    degreeLevel: { type: mongoose.Types.ObjectId, ref: "DegreeLevel" },
    graduationDate: { type: Date },
    classLevel: { type: mongoose.Types.ObjectId, ref: "ClassLevel" },
    GPA: { type: Number },
  },
  analytics:{
    accountCreated: { type: Date , default: Date.now},
    lastLogin: { type: Date , default: Date.now},
    lastModified: { type: Date , default: Date.now},
    //engagement: { type: Number },
    //careerReadiness: { type: Number },
    //academicSuccess: { type: Number},
  },
  careerProfile:{
    resume: { type: mongoose.Types.ObjectId, ref: "Resume" },
    coverLetter: { type: mongoose.Types.ObjectId, ref: "CoverLetter" },
    portfolio: { type: mongoose.Types.ObjectId, ref: "Portfolio" },
    linkedIn: { type: String },
    personalWebsite: { type: String },
    github: { type: String },
    stackOverflow: { type: String },
    behance: { type: String },
    dribbble: { type: String },
    other: { type: String },
  },
  dashboard: {
    resources: [{ type: mongoose.Types.ObjectId, ref: "Resource" }],
    events: [{ type: mongoose.Types.ObjectId, ref: "Event" }],
    announcements: [{ type: mongoose.Types.ObjectId, ref: "Announcement" }],
  },
  preferences: {
    notifications: { type: Boolean },//expand this later to time, email, phone, ext
  },
});

module.exports = mongoose.model("Student", studentSchema);
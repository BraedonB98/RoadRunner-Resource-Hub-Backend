const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const { isEmail, isMobilePhone, isStrongPassword } = require("validator");

const studentSchema = new Schema({
  user: { type: mongoose.Types.ObjectId, ref: "User" },
  schoolStudentID: { type: String, required: true },
  birthdate: { type: Date, required: true },
  address: { type: mongoose.Types.ObjectId, ref: "Location" },
  permanentAddress: { type: mongoose.Types.ObjectId, ref: "Location" },
  alumni: { type: Boolean, required: true, default: false },
  advisors: [{ type: mongoose.Types.ObjectId, ref: "Staff" }],
  academicDetails: {
    majors: [{ type: mongoose.Types.ObjectId, ref: "Major" }],
    minors: [{ type: mongoose.Types.ObjectId, ref: "Minor" }],
    certificates: [{ type: mongoose.Types.ObjectId, ref: "Certificate" }],
    schools: [{ type: mongoose.Types.ObjectId, ref: "School" }],
    degreeLevel: { type: mongoose.Types.ObjectId, ref: "DegreeLevel" }, //Bachelors, Masters, Doctorate
    graduationDate: { type: Date },
    classLevel: { type: mongoose.Types.ObjectId, ref: "ClassLevel" }, //Freshman, Sophomore, Junior, Senior, Graduate
    GPA: { type: Number },
  },
  analytics: {
    accountCreated: { type: Date, default: Date.now },
    lastLogin: { type: Date, default: Date.now },
    lastModified: { type: Date, default: Date.now },
    status: {
      active: { type: Boolean, default: true },
      statusChangeDate: { type: Date, default: Date.now },
    },
    //engagement: { type: Number },
    //careerReadiness: { type: Number },
    //academicSuccess: { type: Number},
  },
  careerProfile: {
    resumes: [{ type: mongoose.Types.ObjectId, ref: "Resume" }],
    coverLetters: [{ type: mongoose.Types.ObjectId, ref: "CoverLetter" }],
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
    notifications: { type: Boolean }, //expand this later to time, email, phone, ext
  },
});

module.exports = mongoose.model("Student", studentSchema);

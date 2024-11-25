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
  Dashboard: {
    resources: [{ type: mongoose.Types.ObjectId, ref: "Resource" }],
    events: [{ type: mongoose.Types.ObjectId, ref: "Event" }],
    announcements: [{ type: mongoose.Types.ObjectId, ref: "Announcement" }],
  },
  preferences: {
    notifications: { type: Boolean },//expand this later to time, email, phone, ext
  },
});

module.exports = mongoose.model("Student", studentSchema);
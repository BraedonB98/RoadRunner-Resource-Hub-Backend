const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const { isEmail, isMobilePhone, isStrongPassword } = require('validator');

const facultySchema = new Schema({
  schoolFacultyID: { type: String , required: true},
  type: { type: String , required: true},//teaching assistant, adjunct, associate, full
  birthdate: { type: Date },
  address: { type: mongoose.types.ObjectId, ref: "Location" },
  permanentAddress: { type: mongoose.types.ObjectId, ref: "Location" },
  universityStructure:{
    schools: { type: mongoose.Types.ObjectId, ref: "School" },
    department: { type: mongoose.Types.ObjectId, ref: "Department" },
    title: { type: String },
    currentCourses: [{ type: mongoose.Types.ObjectId, ref: "Course" }],
    pastCourses: [{ type: mongoose.Types.ObjectId, ref: "Course" }],
  },
  engagementPostings: {
    careerFair: [{ type: mongoose.Types.ObjectId, ref: "CareerFair" }],
    internship: [{ type: mongoose.Types.ObjectId, ref: "Internship" }],
    event: [{ type: mongoose.Types.ObjectId, ref: "Event" }],
    resource: [{ type: mongoose.Types.ObjectId, ref: "Resource" }],
  },
  analytics:{
    accountCreated: { type: Date , default: Date.now},
    lastLogin: { type: Date , default: Date.now},
    lastModified: { type: Date , default: Date.now},
    status: { 
      active: { type: Boolean , default: true},
      statusChangeDate: { type: Date , default: Date.now},
    },
  },
  permissions: { type: mongoose.Types.ObjectId, ref: "Permission" },
  dashboard: {
    resources: [{ type: mongoose.Types.ObjectId, ref: "Resource" }],
    events: [{ type: mongoose.Types.ObjectId, ref: "Event" }],
    announcements: [{ type: mongoose.Types.ObjectId, ref: "Announcement" }],
  },
  preferences: {
    notifications: { type: Boolean },//expand this later to time, email, phone, ext
  },
});

module.exports = mongoose.model("Faculty", facultySchema);
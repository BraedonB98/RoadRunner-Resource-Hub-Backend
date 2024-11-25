const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const { isEmail, isMobilePhone, isStrongPassword } = require('validator');

const industryPartnerSchema = new Schema({
  
  title: { type: String },
  Qualifications: [{ type: mongoose.Types.ObjectId, ref: "Qualification" }],
  industry: { type: mongoose.Types.ObjectId, ref: "Industry", required: true },
  employer: { type: mongoose.Types.ObjectId, ref: "Employer", required: true },
  address: { type: String },
  permanentAddress: { type: String},
  careerPostings: {
    internship: [{ type: mongoose.Types.ObjectId, ref: "Internship" }],
    job: [{ type: mongoose.Types.ObjectId, ref: "Job" }],
  },
  analytics:{
    accountCreated: { type: Date , default: Date.now},
    lastLogin: { type: Date , default: Date.now},
    lastModified: { type: Date , default: Date.now},
  },
  permissions: { type: mongoose.Types.ObjectId, ref: "Permission" },
  preferences: {
    notifications: { type: Boolean },//expand this later to time, email, phone, ext
  },
});

module.exports = mongoose.model("Staff", staffSchema);
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const { isEmail, isMobilePhone, isStrongPassword } = require('validator');

const userSchema = new Schema({
  firstName: { type: String , required: true},
  middleName: { type: String },
  lastName: { type: String , required: true},
  userName: { type: String , required: true, unique: true},
  preferredName: { type: String },
  gender: { type: String },
  pronouns: { type: String },
  imageUrl: { type: String },
  email: { type: String , required: true, unique: true, validate: [isEmail, 'invalid email']},
  phoneNumber: { type: String , required: true, unique: true, validate: [isMobilePhone, 'invalid phone number']},
  password: { type: String , required: true, validate: [isStrongPassword, 'password is not strong enough']},
  studentAccount: {type: mongoose.Types.ObjectId, ref: "Student"},
  facultyAccount: {type: mongoose.Types.ObjectId, ref: "Faculty"},
  adminAccount: {type: mongoose.Types.ObjectId, ref: "Admin"},
  staffAccount: {type: mongoose.Types.ObjectId, ref: "Staff"},
  contactAccount: {type: mongoose.Types.ObjectId, ref: "IndustryContact"},
});

module.exports = mongoose.model("User", userSchema);

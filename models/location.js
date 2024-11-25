const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const { isEmail, isMobilePhone, isStrongPassword } = require('validator');


const locationSchema = new Schema({
  longitude: { type: Number, required: true },
  latitude: { type: Number, required: true },
  country: { type: String, required: true },
  streetAddress: { type: String, required: true },
  unitNumber:{ type: String },
  city: { type: String, required: true },
  county: { type: String },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
});

module.exports = mongoose.model("Location", locationSchema);
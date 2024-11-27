const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const { isEmail, isMobilePhone, isStrongPassword } = require('validator');

const permissionSchema = new Schema({
  permissionName: { type: String , required: true}, //name of the permission
  permissionDescription: { type: String }, //what the permission allows
  permissionCategory: { type: String }, //academic, department, administrative, etc
  permissionType: { type: String }, //read, write, delete, edit, admin
  permissionLevel: { type: Number },
  permissionValue: { type: Number }, 
  permissionStatus: { type: Boolean },//valid, invalid, pending(can request permission from admin)
  permissionCreated: { type: Date , default: Date.now},
  permissionUpdated: { type: Date , default: Date.now},
  users: [{ type: mongoose.Types.ObjectId, ref: "User" }],
});

module.exports = mongoose.model("Permission", permissionSchema);
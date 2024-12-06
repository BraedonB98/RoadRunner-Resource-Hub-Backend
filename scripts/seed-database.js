//------------------Mongo------------------------
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const User = require("../models/users/user-model");
const Admin = require("../models/users/admin-model");
const bcrypt = require("bcryptjs");
const Location = require("../models/location-model");

console.log(`Repopulating Database - ${process.env.MongoDB_AppName}`);
// Set the strictQuery option to false to prepare for Mongoose 7
mongoose.set("strictQuery", false);

mongoose
  .connect(`mongodb+srv://${process.env.MongoDB_User}:${process.env.MongoDB_Password}@${process.env.MongoDB_Server}/?retryWrites=true&w=majority&appName=${process.env.MongoDB_AppName}`)
  .then(async () => {
    console.log("Connected to database");

    const userCount = await User.countDocuments();
    const adminCount = await Admin.countDocuments();

    if (userCount > 0 || adminCount > 0) {
      console.log("Database already contains documents. Seeding aborted.");
      mongoose.connection.close(() => {
        console.log("Mongoose connection disconnected");
        process.exit(0);
      });
      return;
    }

    const createdLocation = new Location({
      longitude: 39.745918,
      latitude: -105.007492,
      country: "United States",
      streetAddress: "890 Auraria Parkway",
      city: "Denver",
      county: "Denver",
      state: "CO",
      zipCode: "80204",
    });

    const adminAccount = new Admin({
      schoolAdminID: "admin123",
      birthdate: new Date("1980-01-01"),
      address: createdLocation._id,
      permanentAddress: createdLocation._id,
      universityStructure: {
        school: null,
        department: null,
        title: "Administrator",
      },
      engagementPostings: {
        careerFair: [],
        internship: [],
        event: [],
        resource: [],
      },
      analytics: {
        accountCreated: new Date(),
        lastLogin: new Date(),
        lastModified: new Date(),
        status: {
          active: true,
          statusChangeDate: new Date(),
        },
      },
      permissions: [],
      dashboard: {
        resources: [],
        events: [],
        announcements: [],
      },
      preferences: {
        notifications: true,
      },
    });

    const hashedPassword = await bcrypt.hash("StrongPassword123!", 12);

    const user = new User({
      firstName: "Admin",
      middleName: "",
      lastName: "User",
      userName: "adminuser",
      preferredName: "Admin",
      gender: "Other",
      pronouns: "They/Them",
      imageUrl: "",
      email: "admin@example.com",
      phoneNumber: "1234567890",
      password: hashedPassword,
      adminAccount: adminAccount._id,
    });

    await createdLocation.save();
    await adminAccount.save();
    await user.save();

    console.log("Admin user created");
    mongoose.connection.close(() => {
      console.log("Mongoose connection disconnected");
      process.exit(0);
    });
  })
  .catch((error) => {
    console.log(error);
    mongoose.connection.close(() => {
      console.log("Mongoose connection disconnected");
      process.exit(1);
    });
  });

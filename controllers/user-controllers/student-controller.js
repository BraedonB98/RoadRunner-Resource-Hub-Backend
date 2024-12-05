//------------------Auth----------------------------
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//------------------Libraries------------------------
const { isEmail, isMobilePhone, isDate, isStrongPassword } = require("validator");
//------------------Models------------------------------
const mongoose = require("mongoose");
const HttpError = require("../../models/http-error");
const User = require("../../models/users/user-model");
const Student = require("../../models/users/student-model");
const Address = require("../../models/location-model");

//----------------------HelperFunction------------------
const getStudentById = async (sid) => {
  let student;
  try {
    student = await Student.findById(sid);
  } catch (error) {
    return {
      error: error,
      errorMessage: "Could not access student in database",
      errorCode: 500,
    };
  }
  if (!student) {
    return {
      error: true,
      errorMessage: "Student not in database",
      errorCode: 404,
    };
  }
  return student;
};

//------------------Controllers------------------------

const createStudentUser = async (req, res, next) => {
  //Eventually check msu database for student ID to ensure email and SID match
  const { firstName, middleName, lastName, preferredName, gender, pronouns, email, phoneNumber, password, schoolStudentID, birthdate } = req.body;
  const userName = email.split("@")[0];
  console.log(firstName, middleName, lastName, preferredName, gender, pronouns, email, phoneNumber, password, schoolStudentID, birthdate);
  //Validate  email
  let standardizedEmail;
  try {
    if (!isEmail(email) || !email.endsWith("@msudenver.edu")) {
      return next(new HttpError("Invalid email address. Please use an @msudenver.edu email.", 422));
    }
    //Standardize email
    standardizedEmail = email.toLowerCase();
  } catch {
    return next(new HttpError("Invalid email address. Please use an @msudenver.edu email.", 422));
  }

  let formattedPhoneNumber;
  //Validate phone number
  try {
    if (!isMobilePhone(phoneNumber, "en-US")) {
      return next(new HttpError("Invalid phone number", 422));
    }
    // Standardize phone number
    const standardizedPhoneNumber = phoneNumber.replace(/\D/g, ""); // Remove non-numeric characters
    formattedPhoneNumber = `1${standardizedPhoneNumber}`; // Add country code for US
  } catch {
    return next(new HttpError("Invalid phone number", 422));
  }

  // Validate schoolStudentID
  const schoolStudentIDRegex = /^(900|901)\d{6}$/;
  if (!schoolStudentIDRegex.test(schoolStudentID)) {
    return next(new HttpError("Invalid school student ID. It must be 9 digits long and start with 900 or 901.", 422));
  }
  // Validate birthdate

  //Checking if user already has account
  let existingUser;
  try {
    existingUser = await User.findOne({ email: standardizedEmail });
    console.log(existingUser);
    if (!!existingUser) {
      return next(new HttpError("You appear to already have an account, Try signing in?", 409));
    }
  } catch (error) {
    return next(new HttpError("Sign up failed, Could not access database", 500));
  }

  if (existingUser) {
    return next(new HttpError("It appears you already have an account, Try signing in", 409));
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12); //12 is the number of salting rounds(how secure)
  } catch (error) {
    return next(new HttpError("Could not set password correctly", 500));
  }
  //Checking Password Strength
  if (!isStrongPassword(password)) {
    return next(new HttpError("Password is not strong enough(Requires 8 characters, 1, lowercase, 1 uppercase,1 number, and 1 symbol ", 422));
  }

  const createdAddress = new Address({
    longitude: 39.745918,
    latitude: -105.007492,
    country: "United States",
    streetAddress: "890 Auraria Parkway",
    city: "Denver",
    county: "Denver",
    state: "CO",
    zipCode: "80204",
  });

  //Creating new StudentAccount
  const createdStudent = new Student({
    schoolStudentID: schoolStudentID,
    birthdate: birthdate,
    address: null,
    permanentAddress: null,
    alumni: false,
    advisors: [],
    academicDetails: {
      majors: [],
      minors: [],
      certificates: [],
      schools: [],
      degreeLevel: null,
      graduationDate: null,
      classLevel: null,
      GPA: null,
    },
    analytics: {
      accountCreated: Date.now(),
      lastLogin: Date.now(),
      lastModified: Date.now(),
      status: {
        active: true,
        statusChangeDate: Date.now(),
      },
    },
    careerProfile: {
      resumes: [],
      coverLetters: [],
      portfolio: null,
      linkedIn: null,
      personalWebsite: null,
      github: null,
      stackOverflow: null,
      behance: null,
      dribbble: null,
      other: null,
    },
    dashboard: {
      resources: [],
      events: [],
      announcements: [],
    },
    preferences: {
      notifications: true,
    },
  });

  //Creating new user
  const createdUser = new User({
    firstName,
    middleName,
    lastName,
    userName,
    preferredName: preferredName || firstName,
    gender,
    pronouns,
    imageUrl: "data/uploads/images/default.svg",
    email: standardizedEmail,
    phoneNumber: formattedPhoneNumber,
    password: hashedPassword,
    studentAccount: null,
    facultyAccount: null,
    adminAccount: null,
    staffAccount: null,
  });
  //Sending new user to DB
  try {
    //Using transactions to ensure both user and student are created
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdAddress.save({ session: sess });
    createdStudent.address = createdAddress._id;
    createdStudent.permanentAddress = createdAddress._id;
    await createdStudent.save({ session: sess });
    createdUser.studentAccount = createdStudent._id;
    await createdUser.save({ session: sess });
    createdStudent.user = createdUser._id;
    await createdStudent.save({ session: sess });
    await sess.commitTransaction();
  } catch (error) {
    console.log(error);
    return next(new HttpError("Creating user failed", 500));
  }

  //JWT Token
  let token;
  try {
    token = jwt.sign(
      {
        _id: createdUser.id,
        email: createdUser.email,
        name: createdUser.name,
        _studentAccount: createdStudent._id,
        _facultyAccount: null,
        _adminAccount: null,
        _staffAccount: null,
        _contactAccount: null,
        _signedInAs: "student",
      },
      process.env.JWT_Key,
      { expiresIn: "2h" },
    );
  } catch (error) {
    return next(new HttpError("Login Failed", 500));
  }

  res.status(201).json({
    _id: createdUser._id,
    email: createdUser.email,
    token: token,
    studentAccount: createdStudent._id,
    _facultyAccount: null,
    _adminAccount: null,
    _staffAccount: null,
    _contactAccount: null,
    _signedInAs: "student",
  });
};

exports.getStudentById = getStudentById;
exports.createStudentUser = createStudentUser;

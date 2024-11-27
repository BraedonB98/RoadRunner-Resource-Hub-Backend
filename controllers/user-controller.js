//------------------Auth----------------------------
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//------------------Libraries------------------------
const { isEmail, isMobilePhone, isDate, isStrongPassword } = require("validator");
//------------------Models------------------------------
const mongoose = require("mongoose");
const HttpError = require("../models/http-error");
const User = require("../models/users/user-model");
const Student = require("../models/users/student-model");
const Address = require("../models/location-model");

//----------------------HelperFunction------------------
const getUserById = async (uid) => {
  let user;
  if (uid === null) {
    return {
      error: error,
      errorMessage: "no uid provided",
      errorCode: 400,
    };
  }
  if (typeof uid === "string") {
    var ObjectID = require("mongodb").ObjectID;
    uid = new ObjectID(uid);
  }
  try {
    user = await User.findById(uid);
  } catch (error) {
    return {
      error: error,
      errorMessage: "Could not access user in database",
      errorCode: 500,
    };
  }
  if (!user) {
    return {
      error: true,
      errorMessage: "User not in database",
      errorCode: 404,
    };
  }
  return user;
};

const getUserByProp = async (prop, value) => {
  let user;
  try {
    user = await User.findOne({ [prop]: value }); //dynamic property
  } catch (error) {
    console.log(error);
    return {
      error: error,
      errorMessage: `Accessing database failed`,
      errorCode: 500,
    };
  }
  if (!user) {
    return {
      error: true,
      errorMessage: `Could not locate ${prop} in database`,
      errorCode: 404,
    };
  }
  return user;
};

const userInDataBase = async (uid) => {
  let user;
  try {
    user = await User.exists({ _id: uid });
  } catch (error) {
    console.log(error);
    return {
      error: error,
      errorMessage: `Accessing database failed`,
      errorCode: 500,
    };
  }
  return user;
};

//-----------------------Controllers------------------
const createUser = async (req, res, next) => {
  //Eventually check msu database for student ID to ensure email and SID match
  const { firstName, middleName, lastName, userName, preferredName, gender, pronouns, email, phoneNumber, password, schoolStudentID, birthdate } = req.body;

  //Validate  email
  if (!isEmail(email) || !email.endsWith("@msudenver.edu")) {
    return next(new HttpError("Invalid email address. Please use an @msudenver.edu email.", 422));
  }
  //Standardize email
  const standardizedEmail = email.toLowerCase();

  //Validate phone number
  if (!isMobilePhone(phoneNumber, "en-US")) {
    return next(new HttpError("Invalid phone number", 422));
  }
  // Standardize phone number
  const standardizedPhoneNumber = phoneNumber.replace(/\D/g, ""); // Remove non-numeric characters
  const formattedPhoneNumber = `+1${standardizedPhoneNumber}`; // Add country code for US

  // Validate schoolStudentID
  const schoolStudentIDRegex = /^(900|901)\d{6}$/;
  if (!schoolStudentIDRegex.test(schoolStudentID)) {
    return next(new HttpError("Invalid school student ID. It must be 9 digits long and start with 900 or 901.", 422));
  }
  // Validate birthdate
  if (!isDate(birthdate)) {
    return next(new HttpError("Invalid birthdate. Please provide a valid date.", 422));
  }
  // Convert birthdate to Date object
  const birthdateObj = new Date(birthdate);
  if (isNaN(birthdateObj.getTime())) {
    return next(new HttpError("Invalid birthdate. Please provide a valid date.", 422));
  }
  //Checking if user already has account
  let existingUser;
  try {
    existingUser = await User.findOne({ email: standardizedEmail });
    if (!existingUser) {
      existingUser = await User.findOne({ phoneNumber: formattedPhoneNumber });
    }
  } catch (error) {
    return next(new HttpError("Sign up failed, Could not access database", 500));
  }

  if (existingUser) {
    return next(new HttpError("Could not create user, credentials(phonenumber or email) already in use"), 422);
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
    token = jwt.sign({ _id: createdUser.id, email: createdUser.email, name: createdUser.name }, process.env.JWT_Key, { expiresIn: "2h" });
  } catch (error) {
    return next(new HttpError("Login Failed", 500));
  }

  res.status(201).json({ _id: createdUser._id, email: createdUser.email, token: token, _studentid: createdStudent._id });
};

const login = async (req, res, next) => {
  const { email, phoneNumber, password } = req.body;
  //Locating User
  let existingUser;
  if (!phoneNumber) {
    existingUser = await getUserByProp("email", email);
    if (!!existingUser.error) {
      return next(new HttpError(existingUser.errorMessage, existingUser.errorCode));
    }
  }
  if (!email) {
    existingUser = await getUserByProp("phoneNumber", phoneNumber);
    if (!!existingUser.error) {
      return next(new HttpError(existingUser.errorMessage, existingUser.errorCode));
    }
  }

  //Checking Passwords
  let isValidPassword;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (error) {
    return next(new HttpError("Not able to check credentials", 500));
  }
  if (!isValidPassword) {
    return next(new HttpError("Login Failed,invalid credentials", 401));
  }
  //JWT Token
  let token;
  try {
    token = jwt.sign(
      {
        _id: existingUser.id,
        email: existingUser.email,
        name: existingUser.name,
      },
      process.env.JWT_Key,
      { expiresIn: "2h" },
    );
  } catch (error) {
    return next(new HttpError("Logging in user failed", 500));
  }
  const userRestricted = {
    name: existingUser.name,
    email: existingUser.email,
    _id: existingUser._id,
    token: token,
    imageUrl: existingUser.imageUrl,
  };

  res.json(userRestricted);
};

const photoUpload = async (req, res, next) => {
  const uid = req.userData._id;

  //getting user from DB
  let user = await getUserById(uid);
  if (!!user.error) {
    return next(new HttpError(user.errorMessage, user.errorCode));
  }

  //save user with new image URL
  try {
    //if user is using default image
    if (user.imageUrl === "../uploads/images/2DoFinanceLogo.png") {
      user.imageUrl = req.file.path;
    }
    //Delete custom image uploads
    else {
      fs.unlink(user.imageUrl, (err) => {
        console.log(err);
      });
      user.imageUrl = req.file.path;
    }
    await user.save();
  } catch (error) {
    return next(new HttpError("Could not update photo in database", 500));
  }

  res.json({ user: user.imageUrl.toObject({ getters: true }) });
};

//---------------------Exports--------------------------
exports.createUser = createUser;
exports.login = login;
exports.photoUpload = photoUpload;

exports.getUserById = getUserById;
exports.getUserByProp = getUserByProp;
exports.userInDataBase = userInDataBase;

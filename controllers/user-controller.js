//------------------Auth----------------------------
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//------------------Libraries------------------------

//------------------Models------------------------------

const HttpError = require("../models/http-error");
const User = require("../models/users/user-model");

//------------------Sub-Controllers------------------------
const studentController = require("./user-controllers/student-controller");
const { get } = require("mongoose");

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

const authGetUserByProp = async (userKey, userValue, signedInAs) => {
  //!right now only checks if is user or user has admin account, not permissions
  //(uid of reqquested user, uid of signed in as)
  let signedInUser;
  let userRequested;
  if (userKey === "email") {
    const standardizedEmail = email.toLowerCase();
    userRequested = await getUserByProp("email", standardizedEmail);
  } else if (userKey === "phoneNumber") {
    const standardizedPhoneNumber = phoneNumber.replace(/\D/g, ""); // Remove non-numeric characters
    const formattedPhoneNumber = `+1${standardizedPhoneNumber}`; // Add country code for US
    userRequested = await getUserByProp("phoneNumber", formattedPhoneNumber);
  } else {
    userRequested = await getUserByProp(userKey, userValue);
  }
  signedInUser = await getUserById(signedInAs);

  if (!!signedInUser.error) {
    return {
      error: true,
      errorMessage: signedInUser.errorMessage, //!could update to say who the error is with
      errorCode: signedInUser.errorCode,
    };
  }
  if (!!userRequested.error) {
    return {
      error: true,
      errorMessage: userRequested.errorMessage, //!could update to say who the error is with
      errorCode: userRequested.errorCode,
    };
  }
  if (signedInUser._id === userRequested._id || signedInUser.adminAccount) {
    return userRequested;
  }
  return false;
};

const userInDataBase = async (uid) => {
  let inDatabase;
  try {
    inDatabase = await User.exists({ _id: uid });
  } catch (error) {
    console.log(error);
    return {
      error: error,
      errorMessage: `Accessing database failed`,
      errorCode: 500,
    };
  }
  return inDatabase;
};

//-----------------------Controllers------------------
const login = async (req, res, next) => {
  const { email, phoneNumber, password, signInAs } = req.body;
  //Locating User
  //Standardize email

  let existingUser;
  if (!phoneNumber) {
    const standardizedEmail = email.toLowerCase();
    existingUser = await getUserByProp("email", standardizedEmail);
    if (!!existingUser.error) {
      return next(new HttpError(existingUser.errorMessage, existingUser.errorCode));
    }
  }
  if (!email) {
    // Standardize phone number
    const standardizedPhoneNumber = phoneNumber.replace(/\D/g, ""); // Remove non-numeric characters
    const formattedPhoneNumber = `+1${standardizedPhoneNumber}`; // Add country code for US
    existingUser = await getUserByProp("phoneNumber", formattedPhoneNumber);
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
  //checking if they have valid account type
  if (signInAs === "student" && !existingUser.studentAccount) {
    return next(new HttpError("Login Failed, you do not have a student account", 401));
  }
  if (signInAs === "faculty" && !existingUser.facultyAccount) {
    return next(new HttpError("Login Failed, you do not have a faculty account", 401));
  }
  if (signInAs === "admin" && !existingUser.adminAccount) {
    return next(new HttpError("Login Failed, you do not have an admin account", 401));
  }
  if (signInAs === "staff" && !existingUser.staffAccount) {
    return next(new HttpError("Login Failed, you do not have a staff account", 401));
  }
  if (signInAs === "contact" && !existingUser.contactAccount) {
    return next(new HttpError("Login Failed, you do not have a industry contact account", 401));
  }

  //JWT Token
  let token;
  try {
    token = jwt.sign(
      {
        _id: existingUser.id,
        email: existingUser.email,
        name: existingUser.name,
        _studentAccount: existingUser._studentAccount,
        _facultyAccount: existingUser._facultyAccount,
        _adminAccount: existingUser._adminAccount,
        _staffAccount: existingUser._staffAccount,
        _contactAccount: existingUser._contactAccount,
        _signedInAs: signInAs,
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
    _studentAccount: existingUser.studentAccount,
    _facultyAccount: existingUser.facultyAccount,
    _adminAccount: existingUser.adminAccount,
    _staffAccount: existingUser.staffAccount,
    _contactAccount: existingUser.contactAccount,
    _signedInAs: signInAs,
  };

  res.json(userRestricted);
};

const switchAccountType = async (req, res, next) => {
  //This function will take a signed in user and switch the _signedInAs property to a different account type
};

const updateUserInformation = async (req, res, next) => {
  //update information in the user model except for studentAccount, facultyAccount, adminAccount, staffAccount, contactAccount
};

const getUserInformation = async (req, res, next) => {
  //return all information in the user model but must be from an admin account or self
  const userRequestKey = req.params.userkey;
  const userRequestedValue = req.params.uservalue;
  const userAccessing = req.userData._id;
  console.log(userRequestKey, userRequestedValue, userAccessing);
  let user;
  user = await authGetUserByProp(userRequestKey, userRequestedValue, userAccessing);
  console.log(user);
  if (!!user.error) {
    return next(new HttpError(user.errorMessage, user.errorCode));
  }
  if (user === false) {
    return next(new HttpError("You do not have permission to access this user", 401));
  }

  res.json({ user: user.toObject({ getters: true }) });
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
    if (user.imageUrl === "../data/uploads/images/default.svg") {
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
exports.createStudentUser = studentController.createStudentUser;
exports.login = login;
exports.photoUpload = photoUpload;
exports.getUserInformation = getUserInformation;
exports.getUserById = getUserById;
exports.getUserByProp = getUserByProp;
exports.userInDataBase = userInDataBase;

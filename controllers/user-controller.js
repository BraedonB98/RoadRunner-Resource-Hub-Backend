//------------------Auth----------------------------
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//------------------Models------------------------------
const HttpError = require("../models/http-error");
const User = require("../models/user-model");

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
  const { name, email, phoneNumber, password } = req.body;

  //Checking if user already has account
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
    if (!existingUser) {
      existingUser = await User.findOne({ phoneNumber: phoneNumber });
    }
  } catch (error) {
    return next(
      new HttpError("Sign up failed, Could not access database", 500)
    );
  }

  if (existingUser) {
    return next(
      new HttpError("Could not create user, credentials already in use"),
      422
    );
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12); //12 is the number of salting rounds(how secure)
  } catch (error) {
    return next(new HttpError("Could not set password correctly", 500));
  }

  //Creating new user
  const createdUser = new User({
    name,
    subscription: "noSub",
    imageUrl: "data/uploads/images/default.svg",
    email,
    phoneNumber: "+1" + phoneNumber,
    password: hashedPassword,
    permissions: [],//student, faculty, staff, admin
    resources: [],
  });
  //Sending new user to DB
  try {
    await createdUser.save();
  } catch (error) {
    return next(new HttpError("Creating user failed", 500));
  }

  //JWT Token
  let token;
  try {
    token = jwt.sign(
      { _id: createdUser.id, email: createdUser.email, name: createdUser.name },
      process.env.JWT_Key,
      { expiresIn: "2h" }
    );
  } catch (error) {
    return next(new HttpError("Login Failed", 500));
  }

  res
    .status(201)
    .json({ _id: createdUser._id, email: createdUser.email, token: token });
};

const login = async (req, res, next) => {
  const { email, phoneNumber, password } = req.body;
  //Locating User
  let existingUser;
  if (!phoneNumber) {
    existingUser = await getUserByProp("email", email);
    if (!!existingUser.error) {
      return next(
        new HttpError(existingUser.errorMessage, existingUser.errorCode)
      );
    }
  }
  if (!email) {
    existingUser = await getUserByProp("phoneNumber", phoneNumber);
    if (!!existingUser.error) {
      return next(
        new HttpError(existingUser.errorMessage, existingUser.errorCode)
      );
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
      { expiresIn: "2h" }
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

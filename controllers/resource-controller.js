//------------------Models------------------------------
const HttpError = require("../models/http-error");
const User = require("../models/users/user-model");
//const Student = require("../models/users/student-model");
const ExternalResource = require("../models/resources/external-resource-model");
const userController = require("../controllers/user-controller");

//------------------Libraries---------------------------
const fs = require("fs");
const path = require("path");

//----------------------HelperFunction------------------
const getResourceById = async (rid) => {
  let resource;
  try {
    resource = await ExternalResource.findById(rid);
  } catch (error) {
    return {
      error: error,
      errorMessage: "Could not access resource in database",
      errorCode: 500,
    };
  }
  if (!resource) {
    return {
      error: true,
      errorMessage: "Resource not in database",
      errorCode: 404,
    };
  }
  return resource;
};

//----------------------Controllers------------------
const getPublicResources = async (req, res, next) => {
  //! eventually only return "resourcePageSize" number of resources
  //returns a list of resources for the new students
  const resourceType = req.params.resourceType;
  let resources;
  try {
    resources = await ExternalResource.find({ audience: { $in: [resourceType] } });
  } catch (error) {
    return next(new HttpError("Could not access database", 500));
  }
  console.log(resources);
  if (!resources || resources.length === 0) {
    return next(new HttpError("No resources found", 404));
  }

  res.status(200).json({ resources: resources });
};

const getDashboardResources = async (req, res, next) => {
  //returns a list of resources for the users dashboard

  const userId = req.userData._id; //!change to student ID

  let user = await userController.getUserById(userId);
  if (!!user.error) {
    return next(new HttpError(user.errorMessage, user.errorCode));
  }
  const accountType = "student";
  let account;
  account = await getUserAccountByUser(uid, accountType);
  if (!!account.error) {
    return next(new HttpError(user.errorMessage, user.errorCode));
  }
  account.dashboard.resources.forEach((element) => {
    //!needs to be tested
    console.log(element);
  });

  res.status(200).json({ resources: resources });
};

const createResource = async (req, res, next) => {
  const { title, tags, description, link, audience } = req.body;
  const userId = req.userData._id;

  let existingResource;
  try {
    existingResource = await ExternalResource.findOne({ title: title });
  } catch (error) {
    return next(new HttpError("Resource creation failed, could not access database", 500));
  }
  if (existingResource) {
    return next(new HttpError("Resource already exists", 422));
  }

  // Use req.file.path if file exists, otherwise set to null or default image path
  const imagePath = req.file ? req.file.path : "/data/uploads/resourceImages/DefaultResourceImage.jpg";

  const createdResource = new ExternalResource({
    title,
    tags,
    description,
    link,
    image: imagePath,
    creator: userId,
    audience,
    users: [userId],
    analytics: {
      resourceCreated: Date.now(),
      lastModified: Date.now(),
      status: {
        active: true,
        statusChangeDate: Date.now(),
      },
    },
  });

  try {
    await createdResource.save();
  } catch (error) {
    return next(new HttpError("Resource creation failed, could not save to database", 500));
  }

  res.status(201).json({ resource: createdResource });
};

const deleteResource = async (req, res, next) => {
  const resourceId = req.params.rid;

  let resource;
  try {
    resource = await ExternalResource.findById(resourceId);
  } catch (error) {
    return next(new HttpError("Resource deletion failed, could not access database", 500));
  }

  if (!resource) {
    return next(new HttpError("Resource not found", 404));
  }

  // Delete image file if it exists
  if (resource.image !== "/data/uploads/resourceImages/DefaultResourceImage.jpg") {
    fs.unlink(resource.image, (error) => {
      console.log(error);
    });
  }

  try {
    await resource.remove();
  } catch (error) {
    return next(new HttpError("Resource deletion failed, could not remove from database", 500));
  }

  res.status(200).json({ message: "Resource deleted" });
};

exports.getDashboardResources = getDashboardResources;
exports.getPublicResources = getPublicResources;
exports.createResource = createResource;
exports.deleteResource = deleteResource;

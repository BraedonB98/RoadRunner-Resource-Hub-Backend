//------------------Models------------------------------
const HttpError = require("../models/http-error");
const User = require("../models/users/user-model");
//const Student = require("../models/users/student-model");
const Resource = require("../models/resources/external-resource-model");
const userController = require("../controllers/user-controller");
const getUserById = userController.getUserById;

//------------------Libraries---------------------------
const fs = require("fs");
const path = require("path");

//----------------------HelperFunction------------------
const getResourceById = async (rid) => {
  let resource;
  try {
    resource = await Resource.findById(rid);
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
  const { resourceType, resourcePageNumber, resourcePageSize } = req.body;
  let resources;
  try {
    resources = await Resource.find({ audience: { $in: [resourceType] } }); //
  } catch (error) {
    return next(new HttpError("Could not access database", 500));
  }
  if (!resources || resources.length === 0) {
    return next(new HttpError("No resources found", 404));
  }

  res.status(200).json({ resources: resources });
};

const getDashboardResources = async (req, res, next) => {
  //returns a list of resources for the users dashboard

  const userId = req.userData._id; //!change to student ID

  let user = await getUserById(userId);
  if (!!user.error) {
    return next(new HttpError(user.errorMessage, user.errorCode));
  }
  let student;
  //let studentId = user.student;
  //try{
  //!NEED TO FINISH THIS, Search for student by ID
  //}

  res.status(200).json({ resources: resources });
};

const createResource = async (req, res, next) => {
  const { title, search, description, link, audience } = req.body;
  const userId = req.userData._id;

  let existingResource;
  try {
    existingResource = await Resource.findOne({ title: title });
  } catch (error) {
    return next(new HttpError("Resource creation failed, could not access database", 500));
  }
  if (existingResource) {
    return next(new HttpError("Resource already exists", 422));
  }

  // Use req.file.path if file exists, otherwise set to null or default image path
  const imagePath = req.file ? req.file.path : "path/to/default/image.png";

  const createdResource = new Resource({
    title,
    search,
    description,
    link,
    image: imagePath,
    audience,
    creator: userId,
    users: [userId],
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
    resource = await Resource.findById(resourceId);
  } catch (error) {
    return next(new HttpError("Resource deletion failed, could not access database", 500));
  }

  if (!resource) {
    return next(new HttpError("Resource not found", 404));
  }

  // Delete image file if it exists
  if (resource.image !== "path/to/default/image.png") {
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

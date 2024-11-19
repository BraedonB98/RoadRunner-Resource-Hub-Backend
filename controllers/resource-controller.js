//------------------Models------------------------------
const HttpError = require("../models/http-error");
const User = require("../models/user-model");
const Resource = require("../models/resource-model");

//----------------------Controllers------------------

const getNewStudentResources = async (req, res, next) => {
//returns a list of resources for the new students

    let resources;
    try{
        resources = await Resource.find({audience: { $in: ["New Students"] }}); //
    }
    catch(error){
        return next(new HttpError("Could not access database", 500));
    }
    if(!resources || resources.length === 0){
        return next(new HttpError("No resources found", 404));
    }

    res.status(200).json({resources: resources});


};

const getContinuingStudentResources = async (req, res, next) => {
//returns a list of resources for continuing students

    let resources;
    try{
        resources = await Resource.find({audience: { $in: ["Continuing Students"] }}); // 
    }
    catch(error){
        return next(new HttpError("Could not access database", 500));
    }
    if(!resources || resources.length === 0){
        return next(new HttpError("No resources found", 404));
    }

    res.status(200).json({resources: resources}); 

};

const getGraduatingStudentResources = async (req, res, next) => {

//returns a list of resources for graduating students
    
        let resources;
        try{
            resources = await Resource.find({audience: { $in: ["Graduating Students"] }}); //
        }
        catch(error){
            return next(new HttpError("Could not access database", 500));
        }
        if(!resources || resources.length === 0){
            return next(new HttpError("No resources found", 404));
        }
    
        res.status(200).json({resources: resources});
};

const getDashboardResources = async (req, res, next) => {
//returns a list of resources for the dashboard

    let resources;
    try{
        resources = await Resource.find({audience: { $in: ["Dashboard"] }}); //
    }
    catch(error){
        return next(new HttpError("Could not access database", 500));
    }
    if(!resources || resources.length === 0){
        return next(new HttpError("No resources found", 404));
    }

    res.status(200).json({resources: resources});
};

const getUserResources = async (req, res, next) => {
//returns a list of resources for the user

    const userId = req.params.uid;
    
    let user;
    try {
        user
    }
    catch(error){
        return next(new HttpError("Could not access database", 500));
    }
    if(!user){
        return next(new HttpError("No user found", 404));
    }

    let resources;
    try{
        resources = await Resource.find({users: userId}); // 
    }
    catch(error){
        return next(new HttpError("Could not access database", 500));
    }
    if(!resources || resources.length === 0){
        return next(new HttpError("No resources found", 404));
    }

    res.status(200).json({resources: resources});
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
        users: [userId]
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

    try {
        await resource.remove();
    } catch (error) {
        return next(new HttpError("Resource deletion failed, could not remove from database", 500));
    }

    res.status(200).json({ message: "Resource deleted" });
};

exports.getDashboardResources = getDashboardResources;
exports.getNewStudentResources = getNewStudentResources;
exports.getContinuingStudentResources = getContinuingStudentResources;
exports.getGraduatingStudentResources = getGraduatingStudentResources;
exports.getUserResources = getUserResources;
exports.createResource = createResource;
exports.deleteResource = deleteResource;
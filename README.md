# Welcome to the Road-Runner-Resource-Hub Backend Git Hub!
The goal of this project is to simplify communications between faculty, staff, admins, industry partners, and students to help eliviate the bombardment of information towards students and help hone in on just the information that pertains to THAT student. This github only includes the BACKEND code. 
Please see 
- [Frontend](https://github.com/BraedonB98/RoadRunner-Resource-Hub-Frontend) - For more information on the Frontend Code. 
- [Backend-Project-Board](https://github.com/BraedonB98/RoadRunner-Resource-Hub-Backend/wiki#welcome-to-the-road-runner-resource-hub-backend-development-documents) - For current know issues/Road map
- [Backend-Wiki](https://github.com/users/BraedonB98/projects/3/views/1) - For Developer API information

## Developer Information
### Installation
- `cd ` /RoadRunner-Resource-Hub-Backend
- `npm install`
- install <a href= "https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-windows/#std-label-install-mdb-community-windows">mongodb</a>
- Create nodemon.json file in /RoadRunner-Resource-Hub-Backend
```
{
    "env": {
        "MongoDB_User": "username",
        "MongoDB_Password": "password",
        "MongoDB_Server": "<ClusterName>.rdn2l.mongodb.net",
        "MongoDB_AppName":"<ClusterName>",
        "JWT_Key":"KEY"
    }
}
```

### Tests
https://dev.to/ndohjapan/running-unit-tests-with-mongodb-in-a-nodejs-express-application-using-jest-42de

### Commands
npm run dev - starts up backend server
npm run test - runs tests
npm run test:cleanup - cleans up after tests.

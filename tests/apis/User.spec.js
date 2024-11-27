const request = require("supertest");
const { app } = require("../../app");
const { setup } = require("../test-setup");
setup();

describe("User API", () => {
  it("should return the id, email, token, and mongoStudentID", async () => {
    await request(app).post(`/api/user/student/createstudent`).send({
      firstName: "Braedon",
      middleName: "Marcus",
      lastName: "Bellamy",
      userName: "BraedonB98",
      gender: "Male",
      email: "BBellam04@msudenver.edu",
      phoneNumber: "3039020129",
      password: "Password1?",
      schoolStudentID: "901005268",
      birthdate: "1998/09/01",
    });

    const response = await request(app).get(`/api/user/student/createstudent/latest?page=1&limit=100`).send(); //response from call

    expect(response.body.data.total_docs).toBe(1);
  });

  //   it("should like a rizz", async () => {
  //     const rizzResponse = await request(app).post("/api/v1/rizz").send({ text: "First Rizz" });

  //     const rizzId = rizzResponse.body.data._id;

  //     const response = await request(app).post(`/api/v1/rizz/${rizzId}/like`).send();

  //     expect(response.body.data.likes).toBe(1);
  //   });
});

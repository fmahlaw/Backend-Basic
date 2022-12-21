const request = require("supertest");
const app = require("./server");

const body = {
  username: "username",
  password: "password",
};

describe("POST /users", () => {
  describe("username and password exitst", () => {
    test("should respond with a 200 status code", async () => {
      const response = await request(app).post("/login").send(body);

      expect(response.statusCode).toBe(200);
    });

    test("should respond with a 200 status code", async () => {
      const response = await request(app).post("/login").send(body);

      expect(response.headers["content-type"]).toEqual(
        expect.stringContaining("json")
      );
    });

    test("should respond with a 200 status code", async () => {
      const response = await request(app).post("/login").send(body);

      expect(response.body.userId).toBeDefined();
    });
  });

  describe("username and password don't exitst", () => {
    test("should respond with a 200 status code", async () => {
      const dummyBody = [
        {
          username: "username",
        },
        {
          password: "password",
        },
        {},
      ];

      for (const key in dummyBody) {
        const response = await request(app).post("/login").send(key);
        expect(response.statusCode).toBe(403);
      }
    });
  });
});

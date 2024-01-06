const request = require("supertest");
const app = require("../app");
const db = require("../models/index");

let server, agent;

describe("Todo test Suite", () => {
  beforeAll(async () => {
    server = app.listen(4000, () => {
      console.log("Listening on port 4000");
    });
    agent = request.agent(server);
  });

  afterAll(async () => {
    await db.sequelize.close();
    server.close();
  });

  test("responds with json at /todos", async () => {
    const response = await agent.post("/todos").send({
      title: "Test todo",
      dueDate: new Date().toISOString(),
      completed: false,
    });
    expect(response.statusCode).toBe(200);
    expect(response.header["content-type"]).toBe(
      "application/json; charset=utf-8"
    );
    // const parsedResponse = JSON.parse(response.text);
    // expect(parsedResponse.id).toBe(1);
    const parseResponse = JSON.parse(response.text);
    expect(parseResponse.id).toBeDefined();
  });

  test("Mark a todo as completed", async () => {
    const response = await agent.post("/todos").send({
      title: "Test todo",
      dueDate: new Date().toISOString(),
      completed: false,
    });
    const parseResponse = JSON.parse(response.text);
    const todoId = parseResponse.id;
    expect(parseResponse.completed).toBe(false);

    const markAsCompletedResponse = await agent
      .put(`/todos/${todoId}/markAsCompleted`)
      .send();
    const parseMarkAsCompletedResponse = JSON.parse(
      markAsCompletedResponse.text
    );
    expect(parseMarkAsCompletedResponse.completed).toBe(true);
  });
});

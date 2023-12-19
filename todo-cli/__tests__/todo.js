/* eslint-disable no-undef */
const todolist = require("../todo");
const { all, markAsComplete, add } = todolist();

describe("Todo List test suite", () => {
  beforeAll(() => {
    add({
      title: "Test todo",
      dueDate: new Date().toISOString().split("T")[0],
      completed: false,
    });
  });
  test("Should add new todo", () => {
    const listCount = all.length;
    add({
      title: "Test todo",
      dueDate: new Date().toISOString().split("T")[0],
      completed: false,
    });
    expect(all.length).toBe(listCount + 1);
  });

  test("Should mark as complete", () => {
    expect(all[0].completed).toBe(false);
    markAsComplete(0);
    expect(all[0].completed).toBe(true);
  });
});

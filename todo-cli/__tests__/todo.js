/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/*
const todolist = require("../todo");
const { all, markAsComplete, add, overdue, dueToday, dueLater } = todolist();

describe("Todo List test suite", () => {
  beforeAll(() => {
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(new Date().setDate(new Date().getDate() - 1))
      .toISOString()
      .split("T")[0];
    const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1))
      .toISOString()
      .split("T")[0];
    add({
      title: "Overdue Task 1",
      dueDate: yesterday,
      completed: false,
    });
    add({ title: "Overdue Task 2", dueDate: yesterday, completed: true }); // Completed tasks should not be considered overdue
    add({ title: "Current Task", dueDate: today, completed: false });
    add({ title: "Future Task", dueDate: tomorrow, completed: false });
  });

  test("A test that checks creating a new todo.", () => {
    const listCount = all.length;
    add({
      title: "Test todo",
      dueDate: new Date().toISOString().split("T")[0],
      completed: false,
    });
    expect(all.length).toBe(listCount + 1);
  });

  test("A test that checks marking a todo as completed", () => {
    expect(all[0].completed).toBe(false);
    markAsComplete(0);
    expect(all[0].completed).toBe(true);
  });
  test("A test that checks retrieval of overdue items", () => {
    const overdueItems = overdue();

    // Assert the number of overdue items
    expect(overdueItems.length).toBe(2);

    // Assert the title of the overdue item
    expect(overdueItems[0].title).toBe("Overdue Task 1");
  });

  test("A test that checks retrieval of due today items", () => {
    const dueTodayItems = dueToday();

    expect(dueTodayItems[0].dueDate).toBe(
      new Date().toISOString().split("T")[0],
    );
    // console.log(dueTodayItems)

    expect(dueTodayItems[0].title).toBe("Current Task");
  });

  test("A test that checks retrieval of due later items", () => {
    const dueLaterItems = dueLater();

    expect(dueLaterItems.length).toBe(1);

    expect(dueLaterItems[0].title).toBe("Future Task");
  });
});
*/

/*
const db = require("../models");

describe("Todolist Test Suite", () => {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
  });

  test("Should add new todo", async () => {
    const todoItemsCount = await db.Todo.count();
    await db.Todo.addTask({
      title: "Test todo",
      completed: false,
      dueDate: new Date(),
    });
    const newTodoItemsCount = await db.Todo.count();
    expect(newTodoItemsCount).toBe(todoItemsCount + 1);
  });
});
*/

/* eslint-disable no-undef */
/* eslint-disable no-undef */
const db = require("../models");

const getJSDate = (days) => {
  if (!Number.isInteger(days)) {
    throw new Error("Need to pass an integer as days");
  }
  const today = new Date();
  const oneDay = 60 * 60 * 24 * 1000;
  return new Date(today.getTime() + days * oneDay);
};

describe("Tests for functions in todo.js", function () {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
  });

  test("Todo.overdue should return all tasks (including completed ones) that are past their due date", async () => {
    const todo = await db.Todo.addTask({
      title: "This is a sample item",
      dueDate: getJSDate(-2),
      completed: false,
    });
    const items = await db.Todo.overdue();
    expect(items.length).toBe(1);
  });

  test("Todo.dueToday should return all tasks that are due today (including completed ones)", async () => {
    const dueTodayItems = await db.Todo.dueToday();
    const todo = await db.Todo.addTask({
      title: "This is a sample item",
      dueDate: getJSDate(0),
      completed: false,
    });
    const items = await db.Todo.dueToday();
    expect(items.length).toBe(dueTodayItems.length + 1);
  });

  test("Todo.dueLater should return all tasks that are due on a future date (including completed ones)", async () => {
    const dueLaterItems = await db.Todo.dueLater();
    const todo = await db.Todo.addTask({
      title: "This is a sample item",
      dueDate: getJSDate(2),
      completed: false,
    });
    const items = await db.Todo.dueLater();
    expect(items.length).toBe(dueLaterItems.length + 1);
  });

  test("Todo.markAsComplete should change the `completed` property of a todo to `true`", async () => {
    const overdueItems = await db.Todo.overdue();
    const aTodo = overdueItems[0];
    expect(aTodo.completed).toBe(false);
    await db.Todo.markAsComplete(aTodo.id);
    await aTodo.reload();

    expect(aTodo.completed).toBe(true);
  });

  test("For a completed past-due item, Todo.displayableString should return a string of the format `ID. [x] TITLE DUE_DATE`", async () => {
    const overdueItems = await db.Todo.overdue();
    const aTodo = overdueItems[0];
    expect(aTodo.completed).toBe(true);
    const displayValue = aTodo.displayableString();
    expect(displayValue).toBe(
      `${aTodo.id}. [x] ${aTodo.title} ${aTodo.dueDate}`,
    );
  });

  test("For an incomplete todo in the future, Todo.displayableString should return a string of the format `ID. [ ] TITLE DUE_DATE`", async () => {
    const dueLaterItems = await db.Todo.dueLater();
    const aTodo = dueLaterItems[0];
    expect(aTodo.completed).toBe(false);
    const displayValue = aTodo.displayableString();
    expect(displayValue).toBe(
      `${aTodo.id}. [ ] ${aTodo.title} ${aTodo.dueDate}`,
    );
  });

  test("For an incomplete todo due today, Todo.displayableString should return a string of the format `ID. [ ] TITLE` (date should not be shown)", async () => {
    const dueTodayItems = await db.Todo.dueToday();
    const aTodo = dueTodayItems[0];
    expect(aTodo.completed).toBe(false);
    const displayValue = aTodo.displayableString();
    expect(displayValue).toBe(`${aTodo.id}. [ ] ${aTodo.title}`);
  });

  test("For a complete todo due today, Todo.displayableString should return a string of the format `ID. [x] TITLE` (date should not be shown)", async () => {
    const dueTodayItems = await db.Todo.dueToday();
    const aTodo = dueTodayItems[0];
    expect(aTodo.completed).toBe(false);
    await db.Todo.markAsComplete(aTodo.id);
    await aTodo.reload();
    const displayValue = aTodo.displayableString();
    expect(displayValue).toBe(`${aTodo.id}. [x] ${aTodo.title}`);
  });
});

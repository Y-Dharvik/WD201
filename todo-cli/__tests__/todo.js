/* eslint-disable no-undef */
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

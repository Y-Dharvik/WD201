// // models/todo.js
// 'use strict';
// const {
//   Model
// } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//   class Todo extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//      static async addTask(params) {
//       return  await Todo.create(params);
//     }
//     static associate(models) {
//       // define association here
//     }
//     displayableString() {
//       let checkbox = this.completed ? "[x]" : "[ ]";
//       return `${this.id}. ${checkbox} ${this.title} ${this.dueDate}`;
//     }
//   }
//   Todo.init({
//     title: DataTypes.STRING,
//     dueDate: DataTypes.DATEONLY,
//     completed: DataTypes.BOOLEAN
//   }, {
//     sequelize,
//     modelName: 'Todo',
//   });
//   return Todo;
// };

// models/todo.js

// models/todo.js
"use strict";
const { Model, Op } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

    static async addTask(taskParams) {
      return await Todo.create(taskParams);
    }
    static async showList() {
      console.log("My Todo list \n");

      console.log("Overdue");
      // FILL IN HERE

      const overdueTasks = await Todo.overdue();
      overdueTasks.forEach((item) => console.log(item.displayableString()));

      console.log("\n");

      console.log("Due Today");
      // FILL IN HERE

      let todayTasks = await Todo.dueToday();

      todayTasks.forEach((item) => console.log(item.displayableString()));
      console.log("\n");

      console.log("Due Later");
      // FILL IN HERE

      let laterTasks = await Todo.dueLater();

      laterTasks.forEach((item) => console.log(item.displayableString()));
    }

    static async overdue() {
      // FILL IN HERE TO RETURN OVERDUE ITEMS

      return await Todo.findAll({
        where: {
          dueDate: {
            [Op.lt]: new Date(),
          },
        },
      });
    }

    static async dueToday() {
      // FILL IN HERE TO RETURN ITEMS DUE TODAY
      return await Todo.findAll({
        where: {
          dueDate: {
            [Op.eq]: new Date().toISOString().split("T")[0],
          },
        },
      });
    }

    static async dueLater() {
      // FILL IN HERE TO RETURN ITEMS DUE LATER
      return await Todo.findAll({
        where: {
          dueDate: {
            [Op.gt]: new Date().toISOString().split("T")[0],
          },
        },
      });
    }

    static async markAsComplete(id) {
      // FILL IN HERE TO MARK AN ITEM AS COMPLETE
      return await Todo.update(
        { completed: true },
        {
          where: {
            id: id,
          },
        },
      );
    }

    displayableString() {
      const checkbox = this.completed ? "[x]" : "[ ]";
      const currDate = new Date().toISOString().split("T")[0];
      let dispDate = "";
      if (this.dueDate === currDate) {
        dispDate = "";
      } else {
        dispDate = " " + this.dueDate;
      }

      return `${this.id}. ${checkbox} ${this.title}${dispDate}`;
    }
  }
  Todo.init(
    {
      title: DataTypes.STRING,
      dueDate: DataTypes.DATEONLY,
      completed: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Todo",
    },
  );
  return Todo;
};

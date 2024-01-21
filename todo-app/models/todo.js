"use strict";
const { Model, Op} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // eslint-disable-next-line no-unused-vars
    static associate(models) {
      // define association here
    }

    static addTodo({ title, dueDate }) {
      return this.create({ title: title, dueDate: dueDate, completed: false });
    }

    static getTodos(){
      return this.findAll();
    }

    static overDue(){
      return this.findAll({
        where: {
          dueDate:{
            [Op.lt]: new Date(),
          }
        }
      })
    }

    static dueToday(){
      return this.findAll({
        where: {
          dueDate:{
            [Op.eq]: new Date(),
          }
        }
      })
    }

    static dueLater(){
      return this.findAll({
        where: {
          dueDate:{
            [Op.gt]: new Date(),
          }
        }
      })
    }

    markAsCompleted() {
      return this.update({ completed: true });
    }
    static async deleteTodo(id) {
      return await Todo.destroy({ where: { id: id } });
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
    }
  );
  return Todo;
};

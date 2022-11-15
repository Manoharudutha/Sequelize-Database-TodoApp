"use strict";
const { Model, Op } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

    // static associate(models) {
    //   // define association here
    // }

    static async addTask(params) {
      return await Todo.create(params);
    }
    static async showList() {
      console.log("My Todo list \n");

      console.log("Overdue");
      const overdueTodos = await this.overdue();
      const oversdueItemsStr = overdueTodos
        .map((todo) => todo.displayableString())
        .join("\n");
      console.log(oversdueItemsStr);
      console.log("\n");

      console.log("Due Today");
      const dueTodayTodos = await this.dueToday();
      const dueTodayItemsStr = dueTodayTodos
        .map((todo) => todo.displayableString())
        .join("\n");
      console.log(dueTodayItemsStr);
      console.log("\n");

      console.log("Due Later");
      const dueLaterTodos = await this.dueLater();
      const dueLaterItemsStr = dueLaterTodos
        .map((todo) => todo.displayableString())
        .join("\n");
      console.log(dueLaterItemsStr);
    }

    static async overdue() {
      try {
        const formattedDate = (d) => {
          return d.toISOString().split("T")[0];
        };

        const dateToday = new Date();
        const today = formattedDate(dateToday);

        return await Todo.findAll({
          where: {
            dueDate: {
              [Op.lt]: today,
            },
          },
        });
      } catch (error) {
        console.error(error);
      }
    }

    static async dueToday() {
      try {
        const formattedDate = (d) => {
          return d.toISOString().split("T")[0];
        };

        const dateToday = new Date();
        const today = formattedDate(dateToday);

        return await Todo.findAll({
          where: {
            dueDate: {
              [Op.eq]: today,
            },
          },
        });
      } catch (error) {
        console.error(error);
      }
    }

    static async dueLater() {
      try {
        const formattedDate = (d) => {
          return d.toISOString().split("T")[0];
        };

        const dateToday = new Date();
        const today = formattedDate(dateToday);

        return await Todo.findAll({
          where: {
            dueDate: {
              [Op.gt]: today,
            },
          },
        });
      } catch (error) {
        console.error(error);
      }
    }

    static async markAsComplete(id) {
      try {
        return await Todo.update(
          { completed: true },
          {
            where: {
              id: id,
            },
          }
        );
      } catch (error) {
        console.error(error);
      }
    }

    displayableString() {
      let checkbox = this.completed ? "[x]" : "[ ]";

      const formattedDate = (d) => {
        return d.toISOString().split("T")[0];
      };

      const dateToday = new Date();
      const today = formattedDate(dateToday);
      const newDueDate = formattedDate(this.dueDate);

      if (newDueDate === today) return `${this.id}. ${checkbox} ${this.title}`;
      return `${this.id}. ${checkbox} ${this.title} ${newDueDate}`;
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

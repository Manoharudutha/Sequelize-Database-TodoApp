"use strict";
const { Model, Op } = require("sequelize");
const db = require(".");
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

    static async addTask(params) {
      return await Todo.create(params);
    }
    static async showList() {
      console.log("My Todo list \n");

      console.log("Overdue");
      console.log(await this.overdue());
      console.log("\n");

      console.log("Due Today");
      console.log(await this.dueToday());
      console.log("\n");

      console.log("Due Later");
      console.log(await this.dueLater());
    }

    static async overdue() {
      try {
        const formattedDate = (d) => {
          return d.toISOString().split("T")[0];
        };

        const dateToday = new Date();
        const today = formattedDate(dateToday);

        const overdueTodos = await Todo.findAll({
          where: {
            dueDate: {
              [Op.lt]: today,
            },
          },
        });
        const oversdueItemsStr = overdueTodos
          .map((todo) => todo.displayableString())
          .join("\n");
        return oversdueItemsStr;
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

        const dueTodayTodos = await Todo.findAll({
          where: {
            dueDate: {
              [Op.eq]: today,
            },
          },
        });
        const dueTodayItemsStr = dueTodayTodos
          .map((todo) => todo.displayableString())
          .join("\n");
        return dueTodayItemsStr;
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

        const dueLaterTodos = await Todo.findAll({
          where: {
            dueDate: {
              [Op.gt]: today,
            },
          },
        });
        const dueLaterItemsStr = dueLaterTodos
          .map((todo) => todo.displayableString())
          .join("\n");
        return dueLaterItemsStr;
      } catch (error) {
        console.error(error);
      }
    }

    static async markAsComplete(id) {
      try {
        Todo.update(
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

      const newDueDate = formattedDate(this.dueDate);

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

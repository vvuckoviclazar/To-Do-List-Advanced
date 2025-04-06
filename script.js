"use strict";

const projectForm = document.querySelector(".new-project-form");
const projectInput = document.querySelector(".project-input");

class Todo {
  constructor(title) {
    this.title = title;
  }

  getTitle() {
    return this.title;
  }
}

class TodoManager {
  constructor() {
    this.todos = [];
  }

  addTodo(todo) {
    this.todos.push(todo);
  }

  getTodos() {
    return this.todos;
  }
}

const todoManager = new TodoManager();

projectForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const inputValue = projectInput.value;

  if (inputValue === "") return;

  const newTodo = new Todo(inputValue);
  todoManager.addTodo(newTodo);

  projectInput.value = "";

  console.log(
    "Current Todos:",
    todoManager.getTodos().map((todo) => todo.getTitle())
  );
});

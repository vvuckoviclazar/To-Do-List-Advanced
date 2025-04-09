"use strict";

const projectForm = document.querySelector(".new-project-form");
const projectInput = document.querySelector(".project-input");
const newProjectBtn = document.querySelector(".new-project-btn");
const newTodoBtn = document.querySelector(".new-todo-btn");
const todoForm = document.querySelector(".new-todo-form");
const cancelProjectBtn = document.querySelector(".cancle-project-btn");
const cancelTodoBtn = document.querySelector(".cancel-todo-btn");

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

newProjectBtn.addEventListener("click", () => {
  projectForm.classList.toggle("show");
});

newTodoBtn.addEventListener("click", () => {
  todoForm.classList.toggle("show");
});

cancelProjectBtn.addEventListener("click", () => {
  projectForm.classList.remove("show");
});

cancelTodoBtn.addEventListener("click", () => {
  todoForm.classList.remove("show");
});

"use strict";

const projectForm = document.querySelector(".new-project-form");
const projectInput = document.querySelector(".project-input");
const newProjectBtn = document.querySelector(".new-project-btn");
const todoForm = document.querySelector(".new-todo-form");
const todoInput = document.querySelector(".todo-input");
const dateInput = document.querySelector(".date-input");
const addTodoBtn = document.querySelector(".add-todo-btn");
const cancleProjectBtn = document.querySelector(".cancle-project-btn");
const cancleTodoBtn = document.querySelector(".cancle-todo-btn");
const projectList = document.querySelector(".project-list");
const todoList = document.querySelector(".todo-list");
const newTodoBtn = document.querySelector(".new-todo-btn");

class Project {
  constructor(title) {
    this.title = title;
    this.id = crypto.randomUUID();
    this.todos = [];
  }

  getTitle() {
    return this.title;
  }

  getId() {
    return this.id;
  }

  addTodo(todo) {
    this.todos.push(todo);
  }

  getTodos() {
    return this.todos;
  }
}

class ProjectManager {
  constructor() {
    this.projects = [];
  }

  addProject(project) {
    this.projects.push(project);
  }

  getProjects() {
    return this.projects;
  }

  getLastProject() {
    return this.projects[this.projects.length - 1];
  }
}

class Todo {
  constructor(title, date, projectId) {
    this.title = title;
    this.date = date;
    this.projectId = projectId;
    this.id = crypto.randomUUID();
  }

  getTitle() {
    return this.title;
  }

  getDate() {
    return this.date;
  }

  getProjectId() {
    return this.projectId;
  }

  getId() {
    return this.id;
  }
}

const projectManager = new ProjectManager();

function createTodoElement(todo) {
  const li = document.createElement("li");
  li.classList.add("todo-li");

  li.innerHTML = `
    <div class="todo-flex">
      <p class="todo-p">🗒️ Title:</p>
      <p class="todo-text textT">${todo.getTitle()}</p>
    </div>
    <div class="todo-flex">
      <p class="todo-p">📆 Due date:</p>
      <p class="todo-date textT">${todo.getDate()}</p>
    </div>
    <div class="todo-btns-div">
      <button class="edit-btn">edit</button>
      <button class="delete-btn">delete</button>
    </div>
    <p class="check-p">✔️</p>
  `;

  return li;
}

function createProjectElement(id, title) {
  const li = document.createElement("li");
  li.id = id;
  li.classList.add("project-li");

  li.innerHTML = `
    ${title}
    <button class="project-btn-x">✖️</button>
  `;

  return li;
}

projectForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const inputValue = projectInput.value.trim();
  if (inputValue === "") return;

  const newProject = new Project(inputValue);
  projectManager.addProject(newProject);

  const li = createProjectElement(newProject.id, newProject.getTitle());
  projectList.appendChild(li);

  projectInput.value = "";
  projectForm.classList.remove("show");

  console.log("Created Project:", newProject);
});

addTodoBtn.addEventListener("click", (e) => {
  e.preventDefault();

  const todoTitle = todoInput.value.trim();
  const todoDate = dateInput.value;

  if (todoTitle === "" || todoDate === "") return;

  const currentProject = projectManager.getLastProject();
  if (!currentProject) {
    alert("Please create a project first.");
    return;
  }

  const newTodo = new Todo(todoTitle, todoDate, currentProject.getId());
  currentProject.addTodo(newTodo);

  const li = createTodoElement(newTodo);
  todoList.appendChild(li);

  todoInput.value = "";
  dateInput.value = "";
  todoForm.classList.remove("show");

  console.dir(currentProject, { depth: null });
});

newProjectBtn.addEventListener("click", () => {
  projectForm.classList.toggle("show");
});

newTodoBtn.addEventListener("click", () => {
  todoForm.classList.toggle("show");
});

cancleProjectBtn.addEventListener("click", () => {
  projectForm.classList.remove("show");
});

cancleTodoBtn.addEventListener("click", () => {
  todoForm.classList.remove("show");
});

console.log("All Projects (full):", projectManager.getProjects());

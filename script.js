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

  removeTodo(todoId) {
    this.todos = this.todos.filter((todo) => todo.getId() !== todoId);
  }
}

class ProjectManager {
  constructor() {
    this.projects = [];
    this.activeProject = null;
  }

  addProject(project) {
    this.projects.push(project);
  }

  getProjects() {
    return this.projects;
  }

  getActiveProject() {
    return this.activeProject;
  }

  setActiveProject(projectId) {
    this.activeProject = this.projects.find(
      (project) => project.getId() === projectId
    );
  }

  removeProject(id) {
    this.projects = this.projects.filter((project) => project.getId() !== id);
    console.log(this.projects);
  }
}

class Todo {
  constructor(title, date, projectId) {
    this.title = title;
    this.date = date;
    this.id = crypto.randomUUID();
    this.isChecked = false;
    this.isEditing = false;
  }

  getTitle() {
    return this.title;
  }

  getDate() {
    return this.date;
  }

  getId() {
    return this.id;
  }

  switchChecked() {
    this.isChecked = !this.isChecked;
  }

  getChecked() {
    return this.isChecked;
  }

  startEditing() {
    this.isEditing = true;
  }

  stopEditing() {
    this.isEditing = false;
  }

  isBeingEdited() {
    return this.isEditing;
  }

  update(title, date) {
    this.title = title;
    this.date = date;
  }
}

const projectManager = new ProjectManager();

function createTodoElement(todo) {
  const li = document.createElement("li");
  li.classList.add("todo-li");

  if (todo.isBeingEdited()) {
    li.innerHTML = `
      <div class="todo-flex">
        <p class="todo-p">🗒️ Title:</p>
        <input type="text" class="edit-title-input" value="${todo.getTitle()}">
      </div>
      <div class="todo-flex">
        <p class="todo-p">📆 Due date:</p>
        <input type="date" class="edit-date-input" value="${todo.getDate()}">
      </div>
      <div class="todo-btns-div">
        <button class="finish-edit-btn">Finish editing</button>
      </div>
    `;
  } else {
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
      <p class="check-p" data-id="${todo.getId()}">${
      todo.getChecked() ? "✔️" : "X"
    }</p>
    `;
  }

  li.dataset.id = todo.getId();
  return li;
}

function createProjectElement(project) {
  const li = document.createElement("li");
  li.id = project.getId();
  li.classList.add("project-li");
  li.textContent = project.getTitle();

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("project-btn-x");
  deleteBtn.textContent = "✖️";
  li.appendChild(deleteBtn);

  return li;
}

function renderTodosForProject(project) {
  todoList.innerHTML = "";

  project.getTodos().forEach((todo) => {
    const li = createTodoElement(todo);
    todoList.appendChild(li);
  });
}

projectForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const inputValue = projectInput.value;
  if (inputValue === "") return;

  const newProject = new Project(inputValue);
  projectManager.addProject(newProject);

  const li = createProjectElement(newProject);
  projectList.appendChild(li);

  projectInput.value = "";
  projectForm.classList.remove("show");

  console.log("Created Project:", newProject);
  console.dir(projectManager.getProjects(), { depth: null });
});

addTodoBtn.addEventListener("click", (e) => {
  e.preventDefault();

  const todoTitle = todoInput.value;
  const todoDate = dateInput.value;

  const currentProject = projectManager.getActiveProject();
  if (!currentProject) {
    alert("Please select a project first.");
    return;
  }

  if (todoTitle === "" || todoDate === "") return;

  const newTodo = new Todo(todoTitle, todoDate, currentProject.getId());
  currentProject.addTodo(newTodo);

  todoInput.value = "";
  dateInput.value = "";
  todoForm.classList.remove("show");

  renderTodosForProject(currentProject);

  console.log(`Todo added to "${currentProject.getTitle()}":`, newTodo);
});

projectList.addEventListener("click", (e) => {
  const li = e.target.closest(".project-li");
  if (!li) return;

  const id = li.id;
  const project = projectManager.getProjects().find((p) => p.getId() === id);
  if (!project) return;

  if (e.target.closest(".project-btn-x")) {
    projectManager.removeProject(id);
    li.remove();
    todoList.innerHTML = "";
    projectManager.activeProject = null;
    return;
  }

  projectManager.setActiveProject(id);

  document
    .querySelectorAll(".project-li")
    .forEach((el) => el.classList.remove("active"));
  li.classList.add("active");

  console.log(`Project selected: "${project.getTitle()}"`);

  renderTodosForProject(project);
});

todoList.addEventListener("click", (e) => {
  const card = e.target.closest("li");
  if (!card) return;

  const id = card.dataset.id;

  const currentProject = projectManager.getActiveProject();
  if (!currentProject) return;

  const todo = currentProject.getTodos().find((t) => t.getId() === id);
  if (!todo) return;

  const checkBtn = card.querySelector(".check-p");

  if (e.target.closest(".check-p")) {
    todo.switchChecked();
    checkBtn.textContent = todo.getChecked() ? "✔️" : "X";
  }

  if (e.target.closest(".edit-btn")) {
    currentProject.getTodos().forEach((t) => t.stopEditing());
    todo.startEditing();
    renderTodosForProject(currentProject);
  }

  if (e.target.closest(".finish-edit-btn")) {
    const newTitle = card.querySelector(".edit-title-input").value;
    const newDate = card.querySelector(".edit-date-input").value;

    if (newTitle.trim() !== "" && newDate.trim() !== "") {
      todo.update(newTitle, newDate);
    }

    todo.stopEditing();
    renderTodosForProject(currentProject);
  }

  if (e.target.closest(".delete-btn")) {
    currentProject.removeTodo(id);
    card.remove();
  }
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

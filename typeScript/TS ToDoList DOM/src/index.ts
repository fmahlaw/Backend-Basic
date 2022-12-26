import { v4 } from "uuid";

const list = document.querySelector<HTMLUListElement>("#list");
const form = document.getElementById("form") as HTMLFormElement | null;
const input = document.querySelector<HTMLInputElement>("#input");

type Task = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
};

const Tasks: Task[] = loadTasks();
Tasks.forEach(addListItem);
console.log(Tasks);

form?.addEventListener("submit", (e) => {
  e.preventDefault();

  if (input?.value === "" || input?.value == null) return;

  const newTask: Task = {
    id: v4 as unknown as string,
    title: input.value,
    completed: false,
    createdAt: new Date(),
  };

  Tasks.push(newTask);
  saveTasks();

  addListItem(newTask);
  input.value = "";
});

function addListItem(newTask: Task) {
  const item = document.createElement("li");
  const checkbox = document.createElement("input");
  checkbox.addEventListener("change", () => {
    newTask.completed = checkbox.checked;
    saveTasks();
  });
  checkbox.type = "checkbox";
  checkbox.checked = newTask.completed;
  item.append(checkbox, newTask.title);
  list?.append(item);
}

function saveTasks() {
  localStorage.setItem("TASKS", JSON.stringify(Tasks));
}

function loadTasks(): Task[] {
  const tasksJson = localStorage.getItem("TASKS");

  if (!tasksJson) return [];
  return JSON.parse(tasksJson);
}

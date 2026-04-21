// === ПЕРЕМЕННЫЕ ============================================================
let items = [
  "Сделать проектную работу",
  "Полить цветы",
  "Пройти туториал по Реакту",
  "Сделать фронт для своего проекта",
  "Прогуляться по улице в солнечный день",
  "Помыть посуду",
];

const listElement = document.querySelector(".to-do__list");
const formElement = document.querySelector(".to-do__form");
const inputElement = document.querySelector(".to-do__input");

// === ФУНКЦИИ ===============================================================

/**
 * Загружает задачи из localStorage или возвращает дефолтный массив.
 * @returns {Array<string>} массив задач
 */
function loadTasks() {
  const stored = localStorage.getItem("todoItems");
  if (stored) {
    return JSON.parse(stored);
  }
  return items;
}

/**
 * Создаёт DOM-элемент задачи на основе шаблона и наполняет его данными и обработчиками.
 * @param {string} taskText - текст задачи
 * @returns {HTMLLIElement} готовый элемент списка
 */
function createItem(taskText) {
  const template = document.getElementById("to-do__item-template");
  const clone = template.content.querySelector(".to-do__item").cloneNode(true);
  const textElement = clone.querySelector(".to-do__item-text");
  const deleteButton = clone.querySelector(".to-do__item-button_type_delete");
  const duplicateButton = clone.querySelector(
    ".to-do__item-button_type_duplicate"
  );
  const editButton = clone.querySelector(".to-do__item-button_type_edit");

  // Устанавливаем текст задачи
  textElement.textContent = taskText;

  // Удаление задачи
  deleteButton.addEventListener("click", () => {
    clone.remove();
    const currentTasks = getTasksFromDOM();
    saveTasks(currentTasks);
  });

  // Копирование задачи
  duplicateButton.addEventListener("click", () => {
    const itemName = textElement.textContent;
    const newItemElement = createItem(itemName);
    listElement.prepend(newItemElement);
    const currentTasks = getTasksFromDOM();
    saveTasks(currentTasks);
  });

  // Редактирование задачи (дополнительное задание)
  editButton.addEventListener("click", () => {
    textElement.contentEditable = "true";
    textElement.focus();
  });

  textElement.addEventListener("blur", () => {
    textElement.contentEditable = "false";
    const currentTasks = getTasksFromDOM();
    saveTasks(currentTasks);
  });

  return clone;
}

/**
 * Собирает тексты всех задач из DOM и возвращает массив строк.
 * @returns {Array<string>} массив текстов задач
 */
function getTasksFromDOM() {
  const itemsNamesElements = document.querySelectorAll(".to-do__item-text");
  const tasks = [];
  itemsNamesElements.forEach((element) => {
    tasks.push(element.textContent);
  });
  return tasks;
}

/**
 * Сохраняет переданный массив задач в localStorage.
 * @param {Array<string>} tasks - массив задач для сохранения
 */
function saveTasks(tasks) {
  localStorage.setItem("todoItems", JSON.stringify(tasks));
}

// === ИНИЦИАЛИЗАЦИЯ =========================================================

// Загружаем задачи из хранилища
items = loadTasks();

// Отрисовываем существующие задачи на странице
items.forEach((taskText) => {
  const taskElement = createItem(taskText);
  listElement.append(taskElement);
});

// Обработчик отправки формы для добавления новой задачи
formElement.addEventListener("submit", (evt) => {
  evt.preventDefault();

  const newTaskText = inputElement.value.trim();
  if (newTaskText === "") return;

  const newTaskElement = createItem(newTaskText);
  listElement.prepend(newTaskElement);

  inputElement.value = "";

  const currentTasks = getTasksFromDOM();
  saveTasks(currentTasks);
});

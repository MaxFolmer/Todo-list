// Поиск элементов в DOM
const container = document.querySelector('.todo-container');
const input = document.querySelector('#task-input');
const taskList = document.querySelector('#task-list');
const body = document.querySelector('body');
const taskTemplate = document.querySelector('#task-template');
const themeToggle = document.querySelector('#theme-toggle');

// Инициализация задач
let tasks = [];

// Загрузка задач из localStorage
function loadTasksFromLocalStorage() {
    const tasksData = localStorage.getItem('tasks');
    tasks = tasksData ? JSON.parse(tasksData) : [];
    taskList.innerHTML = '';
    
    tasks.forEach(task => {
        const taskClone = taskTemplate.content.cloneNode(true);
        const taskElement = taskClone.querySelector('.task');
        const taskText = taskClone.querySelector('p');
        
        taskElement.dataset.taskId = task.id;
        taskText.textContent = task.text;
        taskList.appendChild(taskClone);
    });
}

// Сохранение задач в localStorage
function saveTasksToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Загрузка темы из localStorage
function loadThemeFromLocalStorage() {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
        container.classList.add('dark-mode');
        body.classList.add('dark-mode');
    }
}

// Сохранение темы в localStorage
function saveThemeToLocalStorage(theme) {
    localStorage.setItem('theme', theme);
}

// Смена темы
function changeMode() {
    const isDark = body.classList.toggle('dark-mode');
    container.classList.toggle('dark-mode');
    saveThemeToLocalStorage(isDark ? 'dark' : 'light');
}

// Добавление задачи
function addTask() {
    const taskText = input.value.trim();
    if (!taskText) return;

    const newTask = {
        id: Date.now(),
        text: taskText
    };

    tasks.push(newTask);
    saveTasksToLocalStorage();

    const taskClone = taskTemplate.content.cloneNode(true);
    const taskElement = taskClone.querySelector('.task');
    const textElement = taskClone.querySelector('p');
    
    taskElement.dataset.taskId = newTask.id;
    textElement.textContent = newTask.text;
    taskList.appendChild(taskClone);

    input.value = '';
}

// Удаление задачи
function deleteTask(taskElement) {
    const taskId = Number(taskElement.dataset.taskId);
    
    tasks = tasks.filter(task => task.id !== taskId);
    saveTasksToLocalStorage();
    taskElement.remove();
}

// Глобальный обработчик событий
document.body.addEventListener('click', event => {
    const target = event.target;
    
    if (target.id === 'theme-toggle') {
        changeMode();
    } else if (target.classList.contains('add-task-btn')) {
        addTask();
    } else if (target.classList.contains('delete-btn')) {
        deleteTask(target.closest('.task'));
    }
});

// Обработчик Enter в поле ввода
input.addEventListener('keydown', event => {
    if (event.key === 'Enter') addTask();
});

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    loadTasksFromLocalStorage();
    loadThemeFromLocalStorage();
});

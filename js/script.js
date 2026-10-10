let userName = localStorage.getItem('dashboardName');
if (!userName) {
    userName = prompt("Welcome! What is your name?") || "User";
    localStorage.setItem('dashboardName', userName);
}

const themeToggleBtn = document.getElementById('theme-toggle');
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
}

themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
});


function updateClock() {
    const now = new Date();
    document.getElementById('time-display').textContent = now.toLocaleTimeString();
    
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('date-display').textContent = now.toLocaleDateString('en-US', options);

    const hour = now.getHours();
    let greeting = 'Good Evening';
    if (hour < 12) greeting = 'Good Morning';
    else if (hour < 18) greeting = 'Good Afternoon';
    
    document.getElementById('greeting-display').textContent = `${greeting}, ${userName}!`;
}
setInterval(updateClock, 1000);
updateClock();

let timerInterval;
let timeLeft = 25 * 60;
let isRunning = false;
const timerDisplay = document.getElementById('timer-display');

function updateTimerDisplay() {
    const m = Math.floor(timeLeft / 60).toString().padStart(2, '0');
    const s = (timeLeft % 60).toString().padStart(2, '0');
    timerDisplay.textContent = `${m}:${s}`;
}

document.getElementById('start-btn').addEventListener('click', () => {
    if (isRunning) return;
    isRunning = true;
    timerInterval = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateTimerDisplay();
        } else {
            clearInterval(timerInterval);
            isRunning = false;
            alert('Focus session complete!');
        }
    }, 1000);
});

document.getElementById('stop-btn').addEventListener('click', () => {
    clearInterval(timerInterval);
    isRunning = false;
});

document.getElementById('reset-btn').addEventListener('click', () => {
    clearInterval(timerInterval);
    isRunning = false;
    timeLeft = 25 * 60;
    updateTimerDisplay();
});

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function renderTasks() {
    const list = document.getElementById('task-list');
    list.innerHTML = '';
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        
        const taskContent = document.createElement('div');
        taskContent.className = 'task-item';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => toggleTask(index));

        const span = document.createElement('span');
        span.textContent = task.text;
        if (task.completed) span.className = 'completed-text';

        taskContent.appendChild(checkbox);
        taskContent.appendChild(span);

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'btn-danger';
        deleteBtn.addEventListener('click', () => deleteTask(index));

        li.appendChild(taskContent);
        li.appendChild(deleteBtn);
        list.appendChild(li);
    });
}

document.getElementById('add-task-btn').addEventListener('click', () => {
    const input = document.getElementById('task-input');
    const text = input.value.trim();
    
    if (text === '') return;

    if (tasks.some(t => t.text.toLowerCase() === text.toLowerCase())) {
        alert('This task already exists!');
        return;
    }

    tasks.push({ text, completed: false });
    localStorage.setItem('tasks', JSON.stringify(tasks));
    input.value = '';
    renderTasks();
});

function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}

function deleteTask(index) {
    tasks.splice(index, 1);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}
renderTasks();

let links = JSON.parse(localStorage.getItem('links')) || [];

function renderLinks() {
    const container = document.getElementById('links-container');
    container.innerHTML = '';
    links.forEach(link => {
        const a = document.createElement('a');
        a.href = link.url.startsWith('http') ? link.url : `https://${link.url}`;
        a.textContent = link.name;
        a.className = 'link-btn';
        a.target = '_blank';
        container.appendChild(a);
    });
}

document.getElementById('add-link-btn').addEventListener('click', () => {
    const nameInput = document.getElementById('link-name');
    const urlInput = document.getElementById('link-url');
    
    if (nameInput.value.trim() !== '' && urlInput.value.trim() !== '') {
        links.push({ name: nameInput.value, url: urlInput.value });
        localStorage.setItem('links', JSON.stringify(links));
        nameInput.value = '';
        urlInput.value = '';
        renderLinks();
    }
});
renderLinks();
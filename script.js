document.addEventListener('DOMContentLoaded', function () {
    const loginPage = document.getElementById('login-page');
    const appContent = document.getElementById('app-content');
    const loginBtn = document.getElementById('login-btn');
    const guestBtn = document.getElementById('guest-btn');

    function showApp() {
        loginPage.classList.add('hidden');
        appContent.classList.remove('hidden');
    }

    loginBtn.addEventListener('click', showApp);
    guestBtn.addEventListener('click', showApp);

    const newTaskInput = document.getElementById('new-task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
    const statsBtn = document.getElementById('stats-btn');
    const statsCard = document.getElementById('stats-card');
    const totalTasksSpan = document.getElementById('total-tasks');
    const completedTasksSpan = document.getElementById('completed-tasks');
    const remainingTasksSpan = document.getElementById('remaining-tasks');
    const allBtn = document.getElementById('all-btn');
    const activeBtn = document.getElementById('active-btn');
    const completedBtn = document.getElementById('completed-btn');
    const clearCompletedBtn = document.getElementById('clear-completed-btn');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let currentFilter = 'all';
    renderTasks();
    updateStats();
    addTaskBtn.addEventListener('click', addTask);
    newTaskInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') addTask();
    });

    statsBtn.addEventListener('click', toggleStats);

    allBtn.addEventListener('click', () => setFilter('all'));
    activeBtn.addEventListener('click', () => setFilter('active'));
    completedBtn.addEventListener('click', () => setFilter('completed'));
    clearCompletedBtn.addEventListener('click', clearCompletedTasks);

    function addTask() {
        const taskText = newTaskInput.value.trim();
        if (taskText) {
            const newTask = {
                id: Date.now(),
                text: taskText,
                completed: false,
                createdAt: new Date().toISOString()
            };

            tasks.push(newTask);
            saveTasks();
            renderTasks();
            updateStats();
            newTaskInput.value = '';
            newTaskInput.focus();
        }
    }

    function renderTasks() {
        const filteredTasks = filterTasks();

        if (filteredTasks.length === 0) {
            taskList.innerHTML = `
                        <div class="px-6 py-4 text-center text-gray-500">
                            ${getEmptyStateMessage()}
                        </div>
                    `;
            return;
        }

        taskList.innerHTML = '';

        filteredTasks.forEach(task => {
            const taskItem = document.createElement('div');
            taskItem.className = 'task-item px-6 py-3 flex items-center';
            taskItem.setAttribute('data-id', task.id);

            taskItem.innerHTML = `
                        <div class="flex items-center flex-grow">
                            <input 
                                type="checkbox" 
                                class="checkbox-custom mr-3" 
                                ${task.completed ? 'checked' : ''}
                                aria-label="Mark task as ${task.completed ? 'active' : 'completed'}"
                            >
                            <span class="${task.completed ? 'completed' : ''}">${task.text}</span>
                        </div>
                        <button class="text-red-400 hover:text-red-600 p-1 delete-btn" aria-label="Delete task">
                            <i class="fas fa-trash"></i>
                        </button>
                    `;

            const checkbox = taskItem.querySelector('input[type="checkbox"]');
            const deleteBtn = taskItem.querySelector('.delete-btn');

            checkbox.addEventListener('change', () => toggleTaskCompletion(task.id));
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                deleteTask(task.id);
            });

            taskList.appendChild(taskItem);
        });
    }

    function toggleTaskCompletion(taskId) {
        tasks = tasks.map(task => {
            if (task.id === taskId) {
                return { ...task, completed: !task.completed };
            }
            return task;
        });

        saveTasks();
        renderTasks();
        updateStats();
    }

    function deleteTask(taskId) {
        tasks = tasks.filter(task => task.id !== taskId);
        saveTasks();
        renderTasks();
        updateStats();
    }

    function clearCompletedTasks() {
        tasks = tasks.filter(task => !task.completed);
        saveTasks();
        renderTasks();
        updateStats();
    }

    function filterTasks() {
        switch (currentFilter) {
            case 'active':
                return tasks.filter(task => !task.completed);
            case 'completed':
                return tasks.filter(task => task.completed);
            default:
                return tasks;
        }
    }

    function setFilter(filter) {
        currentFilter = filter;

        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('font-medium', 'text-indigo-600');
            btn.classList.add('hover:text-indigo-500');
        });

        const activeBtn = document.getElementById(`${filter}-btn`);
        activeBtn.classList.add('font-medium', 'text-indigo-600');
        activeBtn.classList.remove('hover:text-indigo-500');

        renderTasks();
    }

    function updateStats() {
        const total = tasks.length;
        const completed = tasks.filter(task => task.completed).length;
        const remaining = total - completed;

        totalTasksSpan.textContent = `${total} ${total === 1 ? 'task' : 'tasks'}`;
        completedTasksSpan.textContent = `${completed} completed`;
        remainingTasksSpan.textContent = `${remaining} remaining`;
    }

    function toggleStats() {
        statsCard.classList.toggle('hidden');
    }

    function getEmptyStateMessage() {
        switch (currentFilter) {
            case 'active':
                return 'No active tasks. Great job!';
            case 'completed':
                return 'No completed tasks yet. Keep going!';
            default:
                return 'No tasks yet. Add your first task above!';
        }
    }

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
});
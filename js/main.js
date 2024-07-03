"use strict";

// DOM elements
const form = document.querySelector('form');
const inputValue = document.querySelector("#todo-value");
const todoCon = document.querySelector("#todoCon");
const todosLength = document.querySelector(".todosLength");
const completedTodosLength = document.querySelector(".completedTodosLength");
const uncompletedTodoLength = document.querySelector(".uncompletedTodoLength");
const showAllTodos = document.querySelector("#showAllTodos");
const main = document.querySelector("main");
const showCompletedTodos = document.querySelector("#showCompletedTodos");
const showUncompletedTodos = document.querySelector("#showUncompletedTodos");
const showDeletedTodos = document.querySelector("#showDeletedTodos");
const deletedTodosLength = document.querySelector(".deletedTodosLength");
const editTodoCon = document.querySelector("#editTodoCon");

let todoArr = [];
let deletedTodosArr = [];
let todoId = 1;

showAllTodos.addEventListener('click', () => renderTodos(todoArr));
showCompletedTodos.addEventListener('click', () => {
    if(todoArr.filter(todo => todo.isCompleted).length == 0){
        todoCon.innerHTML = `<h1 class="flex font-medium text-gray-500 text-xl items-center justify-center">Not Selected</h1>`
    }else{
        renderTodos(todoArr.filter(todo => todo.isCompleted), todoCon)
    }
});
showUncompletedTodos.addEventListener('click', () => {
    if(todoArr.filter(todo => !todo.isCompleted).length == 0){
        todoCon.innerHTML = `<h1 class="flex font-medium text-gray-500 text-xl items-center justify-center">Not Selected</h1>`
    }else{
        renderTodos(todoArr.filter(todo => !todo.isCompleted), todoCon)
    }
});
showDeletedTodos.addEventListener('click', () => {
    if(deletedTodosArr.length == 0){
        todoCon.innerHTML = `<h1 class="flex font-medium text-gray-500 text-xl items-center justify-center">Not Selected</h1>`
    }else{
        renderTodos(deletedTodosArr, todoCon)
    }
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const todoValue = inputValue.value.trim();

    if (todoValue) {
        const todoObj = {
            title: todoValue,
            id: todoId++,
            isCompleted: false
        };
        todoArr.push(todoObj);
        inputValue.value = "";
        updateTodosStats();
        renderTodos(todoArr);
    } else {
        alert("Please fill the input");
    }
});

function renderTodos(arr) {
    todoCon.innerHTML = "";
    arr.forEach(todo => {
        const div = document.createElement("div");
        div.className = "border rounded-md border-black p-2 mb-2";
        div.innerHTML = `
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <input type="checkbox" class="scale-150" ${todo.isCompleted ? 'checked' : ''}>
                    <p class="${todo.isCompleted ? 'line-through text-gray-400' : ''} font-medium text-lg">${todo.title}</p>
                </div>
                <div class="flex items-center gap-3 text-white">
                    <i onclick="editTodo(${todo.id})" class="fa-solid cursor-pointer fa-pen bg-green-600 rounded-md p-2"></i>
                    <i onclick="deleteTodo(${todo.id})" class="fa-solid cursor-pointer fa-trash-can bg-red-600 rounded-md p-2"></i>
                </div>
            </div>`;
        div.querySelector('input').addEventListener('click', () => {
            todo.isCompleted = !todo.isCompleted;
            updateTodosStats();
            renderTodos(todoArr);
        });
        todoCon.appendChild(div);
    });
    updateTodosStats();
}

function updateTodosStats() {
    todosLength.textContent = todoArr.length;
    completedTodosLength.textContent = todoArr.filter(todo => todo.isCompleted).length;
    uncompletedTodoLength.textContent = todoArr.filter(todo => !todo.isCompleted).length;
    deletedTodosLength.textContent = deletedTodosArr.length;
}

function deleteTodo(todoID) {
    const todoIndex = todoArr.findIndex(todo => todo.id === todoID);
    if (todoIndex !== -1) {
        const deletedTodo = todoArr.splice(todoIndex, 1)[0];
        deletedTodosArr.push(deletedTodo);
        renderTodos(todoArr);
    }
}

function editTodo(todoID) {
    const todoToEdit = todoArr.find(todo => todo.id === todoID);

    main.classList.add("blur-sm");
    editTodoCon.classList.add("top-[50%]");

    editTodoCon.innerHTML = `
        <form onsubmit="event.preventDefault(); saveEditedTodo(${todoToEdit.id})">
            <i onclick="closeEditTodo()" class="fa-solid fa-xmark absolute top-2 right-2 cursor-pointer border-2 border-red-500 w-[30px] h-[30px] flex items-center justify-center rounded-full text-red-500"></i>
            <h1>Edit todo</h1>
            <input type="text" id="editTodoInput" value="${todoToEdit.title}" placeholder="Enter new value" class="text-center outline-none border-2 border-green-600">
            <button type="submit" class="bg-green-600 text-white rounded-md px-3 py-1 mt-2">Save</button>
        </form>
    `;
}

function saveEditedTodo(todoID) {
    const editedTodoInput = editTodoCon.querySelector("#editTodoInput");
    const todoIndex = todoArr.findIndex(todo => todo.id === todoID);
    if (todoIndex !== -1) {
        todoArr[todoIndex].title = editedTodoInput.value;
        closeEditTodo();
        renderTodos(todoArr);
    }
}

function closeEditTodo() {
    main.classList.remove("blur-sm");
    editTodoCon.classList.remove("top-[50%]");
    editTodoCon.innerHTML = "";
}

renderTodos(todoArr);
updateTodosStats();
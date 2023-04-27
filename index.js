import { addTodo, deleteTodo, getTodos } from "./api.js";
import { renderLoginComponent } from "./components/login-component.js";
import { formatDateToRu, formatDateToUs } from "./lib/formatDate/formatDate.js";
import { format } from "date-fns";
const listElement = document.getElementById("list");
const appEl = document.getElementById("app");

// TODO: Получать из хранилища данных
let tasks = [];

let token = "Bearer asb4c4boc86gasb4c4boc86g37w3cc3bo3b83k4g37k3bk3cg3c03ck4k";
token = null;

const fetchTodosAndRender = () => {
    getTodos({ token })
        .then((responseData) => {
            tasks = responseData.todos;
            console.log(tasks);
            renderApp();
        });
};
const renderApp = () => {
    if (!token) {
        renderLoginComponent({
            appEl, fetchTodosAndRender, setToken: (newToken) => {
                token = newToken;
            }
        });
        return;
    }
    const tasksHtml = tasks
        .map((task) => {
            const createDate = format(new Date(task.created_at), 'dd/MM/yyyy hh:mm');
            return `
            <li class="task">
               <p class="task-text">
                ${task.text} (Создал: ${task.user?.name ?? "Неизвестно"})
                 <button data-id="${task.id
                }" class="button delete-button">Удалить </button>
               </p>
                         <p> <i>Задача создана: ${createDate}</i></p> </i> </p>
             </li>`;
        })
        .join("");
    const appHtml = ` <h1>Список задач</h1>
                            <ul class="tasks" id="list">
                                ${tasksHtml} 
                            </ul>
                            <br />
                            <div class="form">
                                <h3 class="form-title">Форма добавления</h3>
                                <div class="form-row">
                                    Что нужно сделать:
                                    <input type="text" id="text-input" class="input" placeholder="Выпить кофе" />
                                </div>
                                <br />
                                <button class="button" id="add-button">Добавить</button>
                            </div>`

    appEl.innerHTML = appHtml;
    const buttonElement = document.getElementById("add-button");
    const deleteButtons = document.querySelectorAll(".delete-button");
    const textInputElement = document.getElementById("text-input");
    buttonElement.addEventListener("click", () => {
        if (textInputElement.value === "") {
            return;
        }

        buttonElement.disabled = true;
        buttonElement.textContent = "Задача добавляется...";

        // подписываемся на успешное завершение запроса с помощью then
        addTodo({
            text: textInputElement.value, token
        })
            .then(() => {
                // TODO: кинуть исключение
                textInputElement.value = "";
            })
            .then(() => {
                return fetchTodosAndRender();
            })
            .then(() => {
                buttonElement.disabled = false;
                buttonElement.textContent = "Добавить";
            })
            .catch((error) => {
                console.error(error);
                alert("Кажется, у вас проблемы с интернетом, попробуйте позже");
                buttonElement.disabled = false;
                buttonElement.textContent = "Добавить";
            });
    });

    for (const deleteButton of deleteButtons) {
        deleteButton.addEventListener("click", (event) => {
            event.stopPropagation();

            const id = deleteButton.dataset.id;

            // подписываемся на успешное завершение запроса с помощью then
            deleteTodo({ token, id })
                .then((response) => {
                    // получили данные и рендерим их в приложении
                    tasks = response.todos;
                    renderApp();
                });
        });
    }
};
renderApp();
    // fetchTodosAndRender();

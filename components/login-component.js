import { loginUser } from "../api.js";

export function renderLoginComponent({ appEl, setToken, fetchTodosAndRender }) {
    const appHtml = `<div class="form">
    <h3 class="form-title">Форма входа</h3>
    <div class="form-row">
        Логин
        <input type="text" id="login-input" class="input" placeholder="Логин" />
        <br>
        Пароль
        <input type="password" id="pwd-input" class="input" placeholder="Пароль" />
    </div>
    <br />
    <button class="button" id="login-button">Войти</button>
</div>`
    appEl.innerHTML = appHtml;
    document.getElementById('login-button').addEventListener('click', () => {
        let login = document.getElementById('login-input').value;
        let password = document.getElementById('pwd-input').value;

        loginUser({ login: login, password: password })
            .then((user) => {
                setToken(`Bearer ${user.user.token}`);
                fetchTodosAndRender();
            }).catch((error) => {
                alert(error.message)
            })
    });
}
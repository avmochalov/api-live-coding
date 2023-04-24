import { loginUser } from "../api.js";

export function renderLoginComponent({ appEl, setToken, fetchTodosAndRender }) {
    let isLoginMode = false;
    function renderForm() {
        const appHtml = `<div class="form">
    <h3 class="form-title">Форма ${isLoginMode ? 'входа' : 'регистрации'}</h3>
    <div class="form-row">
    ${isLoginMode ? '' : `Имя
    <input type="text" id="name-input" class="input" placeholder="Логин" /> <br>`}
        
        Логин
        <input type="text" id="login-input" class="input" placeholder="Логин" />
        <br>
        Пароль
        <input type="password" id="pwd-input" class="input" placeholder="Пароль" />
    </div>
    <br />
    <button class="button" id="login-button">${isLoginMode ? 'Войти' : 'Зарегистрироваться'}</button>
    <button class="button" id="toggle-button">Перейти ${isLoginMode ? 'к регистрации' : 'ко входу'}</button>
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

        document.getElementById('toggle-button').addEventListener('click', () => {
            isLoginMode = !isLoginMode;
            renderForm();
        })
    }
    renderForm();
}
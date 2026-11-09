(function (App) {
    "use strict";

    const debounce = (fn, delay) => {
        let timerId;
        return (...args) => {
            clearTimeout(timerId);
            timerId = setTimeout(() => fn(...args), delay);
        };
    };

    const bindEvents = (items) => {
        const form = document.getElementById("todo-form");
        const listContainer = document.getElementById("todo-list");
        const searchInput = document.getElementById("search");
        const clearBtn = document.getElementById("clear-storage");

        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const input = form.elements.title;
            const errorMsg = form.querySelector(".error-msg");
            const title = input.value.trim();

            if (title.length < 3) {
                input.setCustomValidity("Назва має містити щонайменше 3 символи.");
                input.setAttribute("aria-invalid", "true");
                errorMsg.textContent = input.validationMessage;
                input.focus();
                return;
            }

            input.setCustomValidity("");
            input.removeAttribute("aria-invalid");
            errorMsg.textContent = "";

            const newItem = {
                id: crypto.randomUUID(),
                title: title,
                done: false
            };

            items.push(newItem);
            App.storage.save(items);
            App.render.list(items);
            form.reset();
        });

        listContainer.addEventListener("click", (e) => {
            const li = e.target.closest(".todo-item");
            if (!li || !listContainer.contains(li)) return;

            const id = li.dataset.id;
            const index = items.findIndex(i => i.id === id);
            if (index === -1) return;

            if (e.target.matches(".delete-btn")) {
                items.splice(index, 1);
            } 
            else if (e.target.matches(".toggle-btn")) {
                items[index].done = !items[index].done;
            } 
            else if (e.target.matches(".edit-btn")) {
                const newTitle = prompt("Редагувати справу:", items[index].title);
                if (newTitle !== null && newTitle.trim().length >= 3) {
                    items[index].title = newTitle.trim();
                } else if (newTitle !== null) {
                    alert("Назва має містити щонайменше 3 символи.");
                }
            }

            App.storage.save(items);
            applyFilter(); 
        });

        const applyFilter = () => {
            const query = searchInput.value.toLowerCase().trim();
            const filtered = items.filter(item => item.title.toLowerCase().includes(query));
            App.render.list(filtered);
        };

        searchInput.addEventListener("input", debounce(applyFilter, 300));

        clearBtn.addEventListener("click", () => {
            if (confirm("Видалити всі справи?")) {
                items.length = 0; 
                App.storage.clear();
                App.render.list(items);
            }
        });
    };

    App.events = { bind: bindEvents };
})(window.App = window.App || {});
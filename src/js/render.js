(function (App) {
    "use strict";

    const listElement = document.getElementById("todo-list");
    const totalCount = document.getElementById("total-count");
    const doneCount = document.getElementById("done-count");
    const pendingCount = document.getElementById("pending-count");

    const createNode = (item) => {
        const li = document.createElement("li");
        li.className = `todo-item ${item.done ? "done" : ""}`;
        li.dataset.id = item.id;

        const textSpan = document.createElement("span");
        textSpan.className = "item-text";
        textSpan.textContent = item.title;

        const actionsDiv = document.createElement("div");
        actionsDiv.className = "item-actions";

        const toggleBtn = document.createElement("button");
        toggleBtn.className = "toggle-btn";
        toggleBtn.textContent = item.done ? "Відновити" : "Виконати";

        const editBtn = document.createElement("button");
        editBtn.className = "edit-btn";
        editBtn.textContent = "Редагувати";

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-btn danger";
        deleteBtn.textContent = "×";

        actionsDiv.append(toggleBtn, editBtn, deleteBtn);
        li.append(textSpan, actionsDiv);
        return li;
    };

    const renderList = (items) => {
        listElement.innerHTML = ""; 
        const fragment = document.createDocumentFragment();
        
        items.forEach(item => {
            fragment.append(createNode(item));
        });
        
        listElement.append(fragment);
        updateCounters(items);
    };

    const updateCounters = (items) => {
        const total = items.length;
        const done = items.reduce((acc, curr) => acc + (curr.done ? 1 : 0), 0);
        
        totalCount.textContent = total;
        doneCount.textContent = done;
        pendingCount.textContent = total - done;
    };

    App.render = { list: renderList };
})(window.App = window.App || {});
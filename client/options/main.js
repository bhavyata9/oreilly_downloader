function oreillyDownloaderMain() {
    function rootDirEl() {
        return ord_elById("root_dir_input");
    }

    function serverAddressEl() {
        return ord_elById("server_address_input");
    }

    function addTasksAreaEl() {
        return ord_elById("add_task_area");
    }

    async function restoreOptions() {
        let ops = await ord_getOptions();
        rootDirEl().value = ops.rootDir;
        serverAddressEl().value = ops.serverAddress;
        renderTableWithTasks(ops.tasks);
    }

    async function saveOptions() {        
        let ops = await ord_getOptions();
        ops.rootDir = rootDirEl().value;
        ops.serverAddress = serverAddressEl().value;
        ord_setOptions(ops);
    }

    async function addTasks() {
        let ops = await ord_getOptions();
        let textArea = addTasksAreaEl();
        let urls = textArea.value.split(',');
        let savedTasks = ops.tasks;

        for (let url of urls) {
            let coverUrl = url.trim();
            let match = coverUrl.match(ord_coverUrlReg);
            if (match) {
                let id = match[1];
                let task = new Task(id);
                task.coverUrl = coverUrl;

                if (!savedTasks[id]) {
                    savedTasks[id] = task;
                }
            }
        }

        ops.tasks = savedTasks;

        await ord_setOptions(ops);
        textArea.value = "";

        renderTableWithTasks(ops.tasks);
    }

    function td(contentOrChild) {
        let td = document.createElement("td");
        if (contentOrChild instanceof Element) {
            td.appendChild(contentOrChild)
        } else {
            td.innerHTML = contentOrChild;
        }
        return td;
    }

    async function deleteTask(id) {
        let ops = await ord_getOptions();
        delete ops.tasks[id];
        await ord_setOptions(ops);

        renderTableWithTasks(ops.tasks);
    }

    function renderTableWithTasks(tasks) {
        let table = ord_elById("task_table");
        let rows = table.querySelectorAll(".task-body");
        for (let row of rows) {
            row.remove();
        }
        for (let task of Object.values(tasks)) {
            let tr = document.createElement("tr");
            tr.className = "task-body";
            tr.appendChild(td(task.id));
            tr.appendChild(td(task.coverUrl));
            tr.appendChild(td(task.startUrl));
            tr.appendChild(td(task.folder));
            tr.appendChild(td(task.start));
            tr.appendChild(td(task.finish));
            let button = document.createElement("button");
            button.innerHTML = "Delete";
            button.addEventListener('click', () => {
                deleteTask(task.id);
            });
            tr.appendChild(td(button));
            table.appendChild(tr);
        }
    }

    function main() {
        ord_log("Oreilly Downloader Options");
        document.addEventListener('DOMContentLoaded', restoreOptions);

        ord_elById('add_task_button').addEventListener('click', addTasks);

        ord_elById('save_button').addEventListener('click', saveOptions);
    }

    main();
}

oreillyDownloaderMain();
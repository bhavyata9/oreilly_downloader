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
        updateRunTasks(ops.runTasks);
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

    async function resetTask(id) {
        let ops = await ord_getOptions();
        let exist = ops.tasks[id];
        let newTask = new Task(id);
        newTask.coverUrl = exist.coverUrl;
        newTask.startUrl = exist.startUrl;
        ops.tasks[id] = newTask;
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
            tr.appendChild(td(task.dryRun));
            let deleteButton = document.createElement("button");
            deleteButton.innerHTML = "Delete";
            deleteButton.addEventListener('click', () => {
                deleteTask(task.id);
            });
            let resetButton = document.createElement("button");
            resetButton.innerHTML = "Reset";
            resetButton.addEventListener('click', () => {
                resetTask(task.id);
            });
            let div = document.createElement("div");
            div.appendChild(resetButton);
            div.appendChild(deleteButton);
            tr.appendChild(td(div));
            table.appendChild(tr);
        }
    }

    function updateRunTasks(run) {
        ord_elById('run_task_status').innerHTML = run ? "Running" : "Stop";
    }

    async function saveRunTasks(run) {
        let ops = await ord_getOptions();
        ops.runTasks = run;
        await ord_setOptions(ops);

        updateRunTasks(run);
    }

    function startTasks(dryRun = false) {
        saveRunTasks(true);
        let args = new RunTasksArgs();
        if (dryRun) {
            args.dryRun = true;
        }
        chrome.runtime.sendMessage(new RunTasksArgs());
    }

    function stopTasks() {
        saveRunTasks(false);
    }

    function main() {
        ord_log("Oreilly Downloader Options");
        document.addEventListener('DOMContentLoaded', restoreOptions);

        ord_elById('add_task_button').addEventListener('click', addTasks);
        ord_elById('save_button').addEventListener('click', saveOptions);
        ord_elById('start_tasks').addEventListener('click', () => startTasks(false));
        ord_elById('dry_run_tasks').addEventListener('click', () => startTasks(true));  
        ord_elById('stop_tasks').addEventListener('click', stopTasks);
    }

    main();
}

oreillyDownloaderMain();
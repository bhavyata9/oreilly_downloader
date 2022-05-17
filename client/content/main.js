async function oreillyDownloaderMain() {
    let loadingMs = 2000;
    let titleUrlReg = ord_titleUrlReg;
    let pageUrlReg = ord_pageUrlReg;
    let opts = await ord_getOptions();

    function sel(selector) {
        return document.querySelector(selector);
    }

    function getClickStartButton() {
        return sel("#main > section > article > section > section.detail--mWp5n > div.detailCover--hJEms > a")
    }

    function clickStartButton() {
        return getClickStartButton().click();
    }

    function getTitle() {
        return sel("#main > section > article > section > h2").innerHTML;
    }

    function getNextButton() {
        return sel("#main > section > div > nav > section > div.nextContainer--DE38N > a");
    }

    function getPrevButton() {
        return sel("#main > section > div > nav > section > div.prevContainer--NNo8v > a");
    }

    function getId() {
        return window.location.href.match(titleUrlReg)[1];
    }

    function getPage() {
        return window.location.href.match(pageUrlReg)[1];
    }

    function sleep(ms) {
        return new Promise(r => setTimeout(r, ms));
    }

    function bookFolderPath(folder) {
        return `${opts.rootDir}\\${folder}`;
    }

    async function goBackToCover() {
        while (true) {
            let prev = getPrevButton();
            if (!prev) {
                break;
            }
            if (prev.href.match(ord_coverPathReg)) {
                break;
            }
            ord_log(`Not cover, go back: ${prev.href}`);
            prev.click();
            await sleep(loadingMs);
        }
    }

    async function start(id, args) {
        await goBackToCover();

        let folderPath = bookFolderPath(id);
        await ord_createFolder(opts, folderPath);

        var no = 0;

        while (getNextButton()) {
            let pageName = getPage();
            let prefix = `${no++}`.padStart(4, "0")
            let fileName = `${prefix}-${pageName}`

            ord_log(`Printing ${pageName} as ${fileName}...`);

            if (args.dryRun) {
                ord_log(`Dry runing`);
                await sleep(500);

                if (args.auto) {
                    if (no > 5) {
                        // Auto dryrun will stop at 5.
                        return;
                    }
                }
            } else {
                let rpc = ord_printPage(opts, folderPath, fileName);
                await sleep(500)
                window.print();
                await sleep(500)
                await rpc;
            }
            getNextButton().click();
            await sleep(loadingMs);
        }
    }

    async function stopRunTasks() {
        let ops = await ord_getOptions();
        ops.runTasks = false;
        await ord_setOptions(ops);
    }

    async function updateOpsForStart(id, args) {
        let ops = await ord_getOptions();
        let task = ops.tasks[id];
        if (!task) {
           task = new Task(id);
           ops.tasks[id] = task;
        }
        if (!args.auto) {
            task.startUrl = window.location.href;
        }
        if (args.dryRun) {
            task.dryRun = args.dryRun;
        }
        task.folder = bookFolderPath(id);
        task.start = true;
    
        await ord_setOptions(ops);
    }

    async function updateOpsForFinish(id) {
        let ops = await ord_getOptions();
        let task = ops.tasks[id];
        if (!task) {
            task = new Task(id);
            ops.tasks[id] = task;
        }
        task.folder = bookFolderPath(id);
        task.finish = true;

        await ord_setOptions(ops);
    }

    async function startFromCoverPage(args = new PrintFromCoverArgs()) {
        let title = getTitle();
        let id = getId();
        if (!title) {
            alsert("No title");
        }

        ord_log(`Going to print [${title}] and save into [${bookFolderPath(id)}]`);

        clickStartButton();
        await sleep(loadingMs);

        await updateOpsForStart(id, args);
        await start(id, args);
        await updateOpsForFinish(id);

        ord_log(`Finished print [${title}]`);

        if (args.auto) {
            ord_log("Continue to run next task");
            await chrome.runtime.sendMessage(new RunTasksArgs());
        }
    }

    async function startFromSection(args = new PrintFromThisPageArgs()) {
        let id = getId();

        ord_log(`Going to print from the mid and save into [${bookFolderPath(id)}]`);

        await updateOpsForStart(id, args);
        await start(id, args);
        await updateOpsForFinish(id);

        ord_log(`Finished`);
    }

    function hotkey(func, pred) {
        document.addEventListener("keydown", function(event) {
            if (pred(event)) {
                func();
            }
        });        
    }

    let commandMap = {};

    function listenCmd() {
        chrome.runtime.onMessage.addListener(
            function(request, sender, sendResponse) {
                let commandFunc = commandMap[request.command];
                if (commandFunc) {
                    ord_log(`Received command: ${request.command}`);
                    sendResponse("ack");
                    sleep(1000).then((any) => commandFunc(request));
                } else {
                    ord_log(`Unknown command: ${request.command}`);
                }
            }
          );
    }

    async function main() {
        ord_log("Oreilly Downloader Script Injected");
        ord_log("ctrl+alt+s: start from the book page");
        ord_log("ctrl+alt+p: start from the section page manually");
        ord_log("Or click the chrome extension icon");

        hotkey(startFromCoverPage, event => event.key === "s" && event.altKey && event.ctrlKey);        
        hotkey(startFromSection, event => event.key === "p" && event.altKey && event.ctrlKey);
        hotkey(stopRunTasks, event => event.key === "d" && event.altKey && event.ctrlKey);

        commandMap[ord_cmd_printFromCover] = startFromCoverPage;
        commandMap[ord_cmd_printFromThisPage] = startFromSection;
        listenCmd();

        await chrome.runtime.sendMessage(new ContentPageReadyArgs());
    }

    main();
}

oreillyDownloaderMain();
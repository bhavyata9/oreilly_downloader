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

    function getFolder() {
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

    async function start(folder) {
        let folderPath = bookFolderPath(folder);
        await ord_createFolder(opts, folderPath);

        var no = 0;

        while (getNextButton()) {
            let pageName = getPage();
            let prefix = `${no++}`.padStart(4, "0")
            let fileName = `${prefix}-${pageName}`

            ord_log(`Printing ${pageName} as ${fileName}...`);

            let rpc = ord_printPage(opts, folderPath, fileName);
            await sleep(500)
            window.print();
            await sleep(500)
            await rpc;
            getNextButton().click();
            await sleep(loadingMs);
        }
    }

    async function startFromCoverPage() {
        let title = getTitle();
        let folder = getFolder();
        if (!title) {
            alsert("No title");
        }

        ord_log(`Going to print [${title}] and save into [${bookFolderPath(folder)}]`);

        clickStartButton();
        await sleep(loadingMs);
        await start(folder);

        ord_log(`Finished print [${title}]`);
    }

    async function manuallyStartFromSection() {
        let folder = getFolder();

        ord_log(`Going to print from the mid and save into [${bookFolderPath(folder)}]`);

        start(folder);

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
                if (commandFunc)
                    ord_log(`Received command: ${request.command}`);
                    sleep(1000).then((any) => commandFunc());
                    sendResponse({scheduled: true});
                }
          );
    }

    async function main() {
        ord_log("Oreilly Downloader Script Injected");
        ord_log("ctrl+alt+s: start from the book page");
        ord_log("ctrl+alt+p: start from the section page manually");
        ord_log("Or click the chrome extension icon");

        hotkey(startFromCoverPage, event => event.key === "s" && event.altKey && event.ctrlKey);        
        hotkey(manuallyStartFromSection, event => event.key === "p" && event.altKey && event.ctrlKey);

        commandMap[ord_cmd_printFromCover] = startFromCoverPage;
        commandMap[ord_cmd_printFromThisPage] = manuallyStartFromSection;
        listenCmd();
    }

    main();
}

oreillyDownloaderMain();
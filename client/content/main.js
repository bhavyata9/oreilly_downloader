async function oreillyDownloaderMain() {
    let loadingMs = 2000;
    let titleUrlReg = /learning.oreilly.com\/library\/view\/(.+)\/\d+\//
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

    function sleep(ms) {
        return new Promise(r => setTimeout(r, ms));
    }

    function bookFolderPath(folder) {
        return `${opts.rootDir}\\${folder}`;
    }

    async function start(folder) {
        await ord_createFolder(opts, bookFolderPath(folder));

        /*
        while (getNextButton()) {
            window.print();
            getNextButton().click();
            await sleep(loadingMs);
        }
        */
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
    }

    async function manuallyStartFromSection() {
        let folder = getFolder();

        ord_log(`Going to print from the mid and save into [${bookFolderPath(folder)}]`);

        start(folder);
    }

    function hotkey(func, pred) {
        document.addEventListener("keydown", function(event) {
            if (pred(event)) {
                func();
            }
        });        
    }

    async function main() {
        ord_log("Oreilly Downloader Script Injected");
        ord_log("ctrl+alt+s: start from the book page");
        ord_log("ctrl+alt+p: start from the section page manually");
        hotkey(startFromCoverPage, event => event.key === "s" && event.altKey && event.ctrlKey);        
        hotkey(manuallyStartFromSection, event => event.key === "p" && event.altKey && event.ctrlKey);
    }

    main();
}

oreillyDownloaderMain();
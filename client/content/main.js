function oreillyDownloaderMain() {
    var title;
    let loadingMs = 2000;

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

    function sleep(ms) {
        return new Promise(r => setTimeout(r, ms));
    }

    async function singleStart() {
        title = getTitle();
        if (!title) {
            alsert("No title");
        }

        console.log("Going to print ${title}");

        clickStartButton();
        await sleep(loadingMs);
        await readToPrint();
    }

    async function readToPrint() {
        while (getNextButton()) {
            window.print();
            getNextButton().click();
            await sleep(loadingMs);
        }
    }

    function hotkey(func, pred) {
        document.addEventListener("keydown", function(event) {
            if (pred(event)) {
                func();
            }
        });        
    }

    function main() {
        console.log("Oreilly Downloader Script Injected");
        console.log("ctrl+alt+s: start from the book page");
        console.log("ctrl+alt+p: start from the section page");
        hotkey(singleStart, event => event.key === "s" && event.altKey && event.ctrlKey);        
        hotkey(readToPrint, event => event.key === "p" && event.altKey && event.ctrlKey);
    }

    main();
}

oreillyDownloaderMain();
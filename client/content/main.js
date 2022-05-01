function oreillyDownloaderMain() {
    var title;

    function sel(selector) {
        return document.querySelector(selector);
    }

    function getClickStartButton() {
        return sel("#main > section > article > section > section.detail--mWp5n > div.detailCover--hJEms > a")
    }

    function clickStartButton() {
        return getClickStartButton.click();
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
        if (title === undefined) {
            alsert("No title");
        }

        clickStartButton();
        sleep(1000);

        while (getNextButton() !== undefined) {
            getNextButton().click();
            sleep(1000);
        }
    }

    function main() {
        console.log("Oreilly Downloader Script Injected");
    }

    main();
}

oreillyDownloaderMain();
function oreillyDownloaderMain() {

    async function currentTab() {
        return (await chrome.tabs.query({
            active: true, currentWindow: true,
        }))[0];
    }

    async function showOnPage(regex, id) {
        let tab = await currentTab();
        
        let matches = tab.url.match(regex);
        if (matches != null) {
            ord_elById(id).style.display = "block";
        } else {
            ord_elById(id).style.display = "none";
        }
    }

    async function printFrom(args) {
        let tab = await currentTab();
        await chrome.tabs.sendMessage(tab.id, args);
        window.close();
    }

    async function printFromCover() {
        await printFrom(new PrintFromCoverArgs());
    }

    async function printFromThispage() {
        await printFrom(new PrintFromThisPageArgs());
    }

    function main() {
        ord_log("Oreilly Downloader Popup");

        showOnPage(ord_coverUrlReg, "print_from_cover_item")
        ord_elById("print_from_cover_button").addEventListener('click', printFromCover);

        showOnPage(ord_pageUrlReg, "print_from_this_page_item");
        ord_elById("print_from_this_page_button").addEventListener('click', printFromThispage);
    }

    main();
}

oreillyDownloaderMain();
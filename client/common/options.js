async function ord_getOptions() {
    return chrome.storage.local.get({
        rootDir: "D:\\oreilly_books",
    });
}

async function ord_setOptions(obj) {
    return chrome.storage.local.set(obj);
}
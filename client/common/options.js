async function ord_getOptions() {
    return chrome.storage.local.get({
        rootDir: "D:\\oreilly_books",
        serverAddress: "127.0.0.1:12345",
    });
}

async function ord_setOptions(obj) {
    return chrome.storage.local.set(obj);
}
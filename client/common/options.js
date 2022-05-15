async function ord_getOptions() {
    return chrome.storage.local.get({
        rootDir: "D:\\oreilly_books",
        serverAddress: "http://127.0.0.1:12345",
        tasks: {},
    });
}

async function ord_setOptions(obj) {
    return chrome.storage.local.set(obj);
}

class Task {
    constructor(id) {
        this.id = id;
        this.coverUrl = null;
        this.startUrl = null;
        this.folder = null;
        this.start = false;
        this.finish = false;
    }
}
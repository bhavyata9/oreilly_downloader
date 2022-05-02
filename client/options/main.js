function oreillyDownloaderMain() {
    function elById(id) {
        return document.getElementById(id);
    }

    function rootDirEl() {
        return elById("root_dir_input");
    }

    function serverAddressEl() {
        return elById("server_address_input");
    }

    async function restoreOptions() {
        let ops = await ord_getOptions();
        rootDirEl().value = ops.rootDir;
        serverAddressEl().value = ops.serverAddress;
    }

    async function saveOptions() {
        ord_setOptions({
            rootDir: rootDirEl().value,
            serverAddress: serverAddressEl().value,
        });
    }

    function main() {
        console.log("Oreilly Downloader Options");
        document.addEventListener('DOMContentLoaded', restoreOptions);
        document.getElementById('save_button').addEventListener('click', saveOptions);
    }

    main();
}

oreillyDownloaderMain();
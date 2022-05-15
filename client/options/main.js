function oreillyDownloaderMain() {
    function rootDirEl() {
        return ord_elById("root_dir_input");
    }

    function serverAddressEl() {
        return ord_elById("server_address_input");
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
        ord_log("Oreilly Downloader Options");
        document.addEventListener('DOMContentLoaded', restoreOptions);
        ord_elById('save_button').addEventListener('click', saveOptions);
    }

    main();
}

oreillyDownloaderMain();
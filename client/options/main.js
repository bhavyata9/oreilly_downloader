function oreillyDownloaderMain() {
    async function restoreOptions() {
        let ops = await ord_getOptions();
        document.getElementById("root_dir_input").value = ops.rootDir;
    }

    async function saveOptions() {
        ord_setOptions({
            rootDir: document.getElementById("root_dir_input").value,
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
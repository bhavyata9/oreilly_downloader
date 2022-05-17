
importScripts("../external/chrome-extension-async.js");
importScripts("../common/logger.js");
importScripts("../common/options.js");
importScripts("../common/communication.js");
importScripts("../common/utils.js");

async function oreillyDownloaderMain() {
    async function onContentPageReady(request, sender, sendResponse) {
        sendResponse("ack");
    }

    async function onRunTasks(request, sender, sendResponse) {
        sendResponse("will schedule");
        await peakAndRunTask(request);
    }

    async function peakAndRunTask(request) {
        let ops = await ord_getOptions();
        if (!ops.runTasks) {
            return;
        }

        let tasks = Object.values(ops.tasks);
        let task = tasks.find((task) => !task.finish && task.coverUrl);
        if (!task) {
            ord_log("Not task to run, stop running.");
            ops.runTask = false;
            await ord_setOptions(ops);
            return;
        }

        ord_log(`Start to run task: ${task.id}`);

        let tab = await chrome.tabs.create({
            url: task.coverUrl,
            active: true,
        });

        await ord_sleep(5000);

        let args = new PrintFromCoverArgs();
        args.auto = true;
        if (request.dryRun) {
            args.dryRun = true;
        }
        await chrome.tabs.sendMessage(tab.id, args);
    }

    async function main() {
        ord_log("Background script started, will register event listeners.");

        let commandFunc = {};

        commandFunc[ord_cmd_contentPageReady] = onContentPageReady;
        commandFunc[ord_cmd_runTasks] = onRunTasks;

        chrome.runtime.onMessage.addListener(
            function(request, sender, sendResponse) {
                try {
                    let func = commandFunc[request.command];
                    if (func) {
                        ord_log(`Handle command: ${request.command}`);
                        func(request, sender, sendResponse);
                    } else {
                        ord_log(`Unknown command: ${request.command}`);
                    }
                } catch (e) {
                    console.error("Error handle message", e);
                }
            }
        );
    }

    main();
}


oreillyDownloaderMain();
class BaseArgs {
    constructor(command) {
        this.command = command;
        this.dryRun = false;
        this.auto = false;
    }
}


let ord_cmd_printFromCover = "ord_cmd_printFromCover";
class PrintFromCoverArgs extends BaseArgs {
    constructor() {
        super(ord_cmd_printFromCover);
    }
}

let ord_cmd_printFromThisPage = "ord_cmd_printFromThisPage";
class PrintFromThisPageArgs extends BaseArgs {
    constructor() {
        super(ord_cmd_printFromThisPage);
    }
}

let ord_cmd_runTasks = "ord_cmd_runTasks";
class RunTasksArgs extends BaseArgs {
    constructor() {
        super(ord_cmd_runTasks);
    }
}

let ord_cmd_contentPageReady = "ord_cmd_contentPageReady";
class ContentPageReadyArgs extends BaseArgs {
    constructor() {
        super(ord_cmd_contentPageReady);
    }
}

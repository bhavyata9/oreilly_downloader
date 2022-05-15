class BaseArgs {
    constructor(command) {
        this.command = command;
        this.dryRun = false;
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
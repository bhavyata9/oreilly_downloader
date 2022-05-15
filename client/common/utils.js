function ord_elById(id) {
    return document.getElementById(id);
}

function ord_sel(selector) {    
    return document.querySelector(selector);
}

async function ord_sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
}

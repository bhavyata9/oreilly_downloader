function sel(selector) {
    return document.querySelector(selector);
}

function clickStartButton() {
    return sel("#main > section > article > section > section.detail--mWp5n > div.detailCover--hJEms > a").click();
}

function getTitle() {
    return sel("#main > section > article > section > h2").innerHTML;
}
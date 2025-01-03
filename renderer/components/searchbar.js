import * as statusbar from "./statusbar.js";

export function initiateSearch() {
    const searchValue = document.getElementById('searchInput').value.trim();
    console.log("searchValue:", searchValue);

    if (!searchValue) return;

    window.api.sendSearch(searchValue);

    statusbar.showStatus('Searching...', 'white', true);
    statusbar.clearStatusBar();
}

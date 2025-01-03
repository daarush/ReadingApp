const statusElement = document.querySelector('.status');

export function showStatus(message, color, shake) {
    statusElement.textContent = message;
    statusElement.style.color = color;
    if (shake) {
        statusElement.classList.add('shake');
        setTimeout(() => statusElement.classList.remove('shake'), 1000);
    }
}

export function clearStatusBar() {
    document.querySelector('#searchInput').value = '';
}
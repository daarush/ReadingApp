document.getElementById('searchInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') initiateSearch();
});

function initiateSearch() {
    const searchValue = document.getElementById('searchInput').value.trim();
    if (!searchValue) return;

    const statusElement = document.querySelector('.status');
    statusElement.textContent = 'Fetching image...';

    window.api.sendSearch(searchValue);
}

window.api.onImageResult((imageUrl) => {
    const searchValue = document.getElementById('searchInput').value.trim();
    const resultDiv = document.getElementById('result');
    const statusElement = document.querySelector('.status');

    if (imageUrl) {
        const tile = document.createElement('div');
        tile.className = 'tile';

        const img = document.createElement('img');
        img.src = imageUrl;

        const title = document.createElement('div');
        title.className = 'tile-title';
        title.textContent = searchValue;

        const description = document.createElement('div');
        description.className = 'description';
        description.innerHTML = `
            <div class="rating">
                <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
            </div>
            <div>Favorited: No</div>
            <div>Status: Not read</div>
        `;

        tile.appendChild(img);
        tile.appendChild(title);
        tile.appendChild(description);

        tile.addEventListener('click', () => {
            const newTitle = prompt('Edit Title', searchValue);
            if (newTitle) title.textContent = newTitle;
        });

        resultDiv.appendChild(tile);
        statusElement.textContent = 'Image fetched successfully.';
    } else {
        statusElement.textContent = 'No image found.';
    }
});

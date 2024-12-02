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

        // Image element
        const img = document.createElement('img');
        img.src = imageUrl;

        // Editable title
        const title = document.createElement('div');
        title.className = 'tile-title';
        title.contentEditable = true;
        title.textContent = searchValue;

        // Description container
        const description = document.createElement('div');
        description.className = 'description';

        // Editable rating
        const rating = document.createElement('div');
        rating.className = 'rating';
        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('span');
            star.textContent = '★';
            star.dataset.rating = i;
            star.style.color = i <= 3 ? 'gold' : 'gray'; // Default rating: 3 stars
            star.addEventListener('click', (e) => {
                const stars = rating.querySelectorAll('span');
                stars.forEach((s, index) => {
                    s.style.color = index < i ? 'gold' : 'gray';
                });
            });
            rating.appendChild(star);
        }

        // Editable reading status
        const readingStatus = document.createElement('div');
        const readingStates = ['Not read', 'Reading', 'Read'];
        let currentStatusIndex = 0; // Default: 'Not read'
        readingStatus.textContent = `Status: ${readingStates[currentStatusIndex]}`;
        readingStatus.style.cursor = 'pointer';
        readingStatus.addEventListener('click', () => {
            currentStatusIndex = (currentStatusIndex + 1) % readingStates.length;
            readingStatus.textContent = `Status: ${readingStates[currentStatusIndex]}`;
        });

        // Heart icon for favorite
        const heartIcon = document.createElement('div');
        heartIcon.className = 'heart-icon';
        heartIcon.style.position = 'absolute';
        heartIcon.style.top = '8px';
        heartIcon.style.right = '8px';
        heartIcon.style.color = 'transparent'; // Initially hidden
        heartIcon.textContent = '❤️';

        tile.addEventListener('dblclick', () => {
            const isFavorited = heartIcon.style.color === 'red';
            heartIcon.style.color = isFavorited ? 'transparent' : 'red';
        });

        description.appendChild(rating);
        description.appendChild(readingStatus);

        tile.appendChild(img);
        tile.appendChild(title);
        tile.appendChild(description);
        tile.appendChild(heartIcon);

        resultDiv.appendChild(tile);
        statusElement.textContent = 'Image fetched successfully.';
    } else {
        statusElement.textContent = 'No image found.';
    }
});

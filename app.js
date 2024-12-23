document.getElementById('searchInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') initiateSearch();
});

const existingTitles = [
    { title: "Title 1", type: "Type A" },
    { title: "Title 2", type: "Type B" },
    { title: "Title 3", type: "Type A" },
    { title: "Title 4", type: "" }
];

function initiateSearch() {
    const searchValue = document.getElementById('searchInput').value.trim();
    if (!searchValue) return;

    const regex = /`(.*?)`/g;
    const match = searchValue.match(regex);

    const text = searchValue.replace(regex, '').trim();

    let extratedText = "";
    if (match) {
        extratedText = match.map(item => item.replace(/`/g, ''));
    }

    const newSearchValue = (text + " " + extratedText).trim();

    if (titleExists(text, extratedText)) {
        const statusElement = document.querySelector('.status');
        statusElement.textContent = 'Title Already Exists';
        statusElement.style.color = 'red';
        statusElement.classList.add('shake');
        setTimeout(() => statusElement.classList.remove('shake'), 1000);
        return;
    }

    // Add the new title to the existingTitles array
    existingTitles.push({ title: text, type: extratedText });

    const statusElement = document.querySelector('.status');
    statusElement.textContent = 'Fetching image...';
    statusElement.style.color = ''; // Reset color

    window.api.sendSearch(newSearchValue);
    document.getElementById('searchInput').value = '';
}

function titleExists(title, type) {
    return existingTitles.some(item => item.title.toLowerCase() === title.toLowerCase() && item.type.toLowerCase() === type.toLowerCase());
}

function toCamelCase(string) {
    return string
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

let currentPanelTile = null;

window.api.onImageResult((imageUrl, searchValue) => {
    searchValue = searchValue.trim();

    const regex = /`(.*?)`/g;
    const cleanTitle = toCamelCase(searchValue.replace(regex, '').trim());

    const resultDiv = document.getElementById('result');
    const statusElement = document.querySelector('.status');

    if (imageUrl) {
        const tile = createTile(cleanTitle, imageUrl);
        resultDiv.appendChild(tile);
        statusElement.textContent = 'Image fetched successfully.';
    } else {
        statusElement.textContent = 'No image found.';
    }
});

function createTile(title, imageUrl) {
    const tile = document.createElement('div');
    tile.className = 'tile';

    // Image element
    const img = document.createElement('img');
    img.src = imageUrl;
    img.setAttribute('draggable', 'false');

    // Non-editable title
    const titleDiv = document.createElement('div');
    titleDiv.className = 'tile-title';
    titleDiv.textContent = title;

    // Description container
    const description = document.createElement('div');
    description.className = 'description';

    // Editable rating
    const rating = createRating(0); // Start rating at 0

    // Heart icon for favorite
    const heartIcon = document.createElement('div');
    heartIcon.className = 'heart-icon';
    heartIcon.textContent = '❤️';
    heartIcon.style.color = 'transparent';

    img.addEventListener('dblclick', () => {
        toggleFavorite(heartIcon, tile);
        if (currentPanelTile === tile) updatePanel();
    });

    // Open side panel on tile click
    tile.addEventListener('click', () => {
        currentPanelTile = tile;
        showSidePanel(tile, title, imageUrl, rating);
    });

    // Append elements
    description.appendChild(titleDiv);
    description.appendChild(rating);
    tile.appendChild(img);
    tile.appendChild(description);
    tile.appendChild(heartIcon);
    return tile;
}

function createRating(initialRating) {
    const rating = document.createElement('div');
    rating.className = 'rating';

    for (let i = 1; i <= 5; i++) {
        const star = document.createElement('span');
        star.textContent = '★';
        star.dataset.rating = i;
        star.style.color = i <= initialRating ? 'gold' : 'gray'; // Start with the initial rating
        star.addEventListener('click', () => {
            updateRating(rating, i); // Update rating in tile
            if (currentPanelTile) updatePanel();
        });
        rating.appendChild(star);
    }
    return rating;
}

function updateRating(ratingElement, ratingValue) {
    const stars = ratingElement.querySelectorAll('span');
    stars.forEach((star, index) => {
        star.style.color = index < ratingValue ? 'gold' : 'gray';
    });
}

function toggleFavorite(heartIcon, tile) {
    const isFavorited = heartIcon.style.color === 'red';
    heartIcon.style.color = isFavorited ? 'transparent' : 'red';
    if (currentPanelTile === tile) updatePanel();
}

function showSidePanel(tile, title, imageUrl, tileRating) {
    let sidePanel = document.getElementById('sidePanel');
    if (!sidePanel) {
        sidePanel = document.createElement('div');
        sidePanel.id = 'sidePanel';
        sidePanel.style.cssText = `
            position: fixed;
            top: 0;
            right: 0;
            width: 300px;
            height: 100%;
            background: #1a1a1a;
            color: #f0f0f0;
            padding: 20px;
            box-shadow: -4px 0 10px rgba(0, 0, 0, 0.5);
            z-index: 1000;
            display: flex;
            flex-direction: column;
            gap: 15px;
        `;
        document.body.appendChild(sidePanel);
    }

    sidePanel.innerHTML = `
        <div style="display: flex; justify-content: center; align-items: center;">
            <h3 style="margin: 0;">Edit</h3>
            <button id="closePanel" style="
                background: none;
                border: none;
                color: #f0f0f0;
                font-size: 18px;
                cursor: pointer;
                position: absolute;
                right: 20px;">✖</button>
        </div>
        <div style="margin-top: 20px;">
            <label style="display: block; margin-bottom: 5px;">Title:</label>
            <input type="text" id="panelTitle" value="${tile.querySelector('.tile-title').textContent}" style="
                width: 100%;
                padding: 5px;
                border: 1px solid #333;
                border-radius: 4px;
                background: #2a2a2a;
                color: #f0f0f0;
                outline: none;
                ">
        </div>
        <div style="margin-top: 20px;">
            <label style="display: block; margin-bottom: 5px;">Rating:</label>
            <div id="panelRating" class="rating"></div>
        </div>
        <div style="margin-top: 20px;">
            <label style="display: inline-block; margin-bottom: 5px; margin-right: 10px;">Favorite:</label>
            <button id="panelFavorite" style="
                padding: 5px 10px;
                border: none;
                border-radius: 4px;
                background: ${tile.querySelector('.heart-icon').style.color === 'red' ? '#ff4d4d' : '#333'};
                color: #f0f0f0;
                cursor: pointer;">
                ${tile.querySelector('.heart-icon').style.color === 'red' ? 'Unfavorite' : 'Favorite'}
            </button>
        </div>
    `;

    // Close panel
    document.getElementById('closePanel').addEventListener('click', () => {
        sidePanel.style.display = 'none';
        currentPanelTile = null;
    });

    // Sync title
    document.getElementById('panelTitle').addEventListener('input', (e) => {
        tile.querySelector('.tile-title').textContent = e.target.value;
    });

    // Sync favorite
    document.getElementById('panelFavorite').addEventListener('click', (e) => {
        const heartIcon = tile.querySelector('.heart-icon');
        toggleFavorite(heartIcon, tile);
        e.target.textContent = heartIcon.style.color === 'red' ? 'Unfavorite' : 'Favorite';
        e.target.style.background = heartIcon.style.color === 'red' ? '#ff4d4d' : '#333';
    });

    // Sync rating in the side panel
    const panelRating = document.getElementById('panelRating');
    panelRating.innerHTML = ''; // Clear existing stars

    const currentRating = Array.from(tileRating.querySelectorAll('span')).filter(star => star.style.color === 'gold').length;
    
    // Create stars for side panel based on current rating
    for (let i = 1; i <= 5; i++) {
        const star = document.createElement('span');
        star.textContent = '★';
        star.dataset.rating = i;
        star.style.color = i <= currentRating ? 'gold' : 'gray'; // Sync with the current rating
        star.addEventListener('click', () => {
            updateRating(panelRating, i); // Update panel rating
            updateRating(tileRating, i);  // Update tile rating
        });
        panelRating.appendChild(star);
    }

    sidePanel.style.display = 'flex';
}

function updatePanel() {
    if (!currentPanelTile) return;

    const heartIcon = currentPanelTile.querySelector('.heart-icon');
    const isFavorited = heartIcon.style.color === 'red';
    const panelFavoriteButton = document.getElementById('panelFavorite');

    // Sync favorite
    panelFavoriteButton.textContent = isFavorited ? 'Unfavorite' : 'Favorite';
    panelFavoriteButton.style.background = isFavorited ? '#ff4d4d' : '#333';
}

// Add CSS for shake animation
const style = document.createElement('style');
style.innerHTML = `
    .shake {
        animation: shake 0.5s;
    }

    @keyframes shake {
        0% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        50% { transform: translateX(5px); }
        75% { transform: translateX(-5px); }
        100% { transform: translateX(0); }
    }
`;
document.head.appendChild(style);

// TODO: Add a way to remove tiles
// TODO: Add differnt border colors for different types (create a random color for every new type)
// TODO: image regeneration
// TODO: Differentiate between title and type
// TODO: Add tags + notes
// TODO: save/load
// TODO: bulk add / queue

let currentPanelTile = null;
const statusElement = document.querySelector('.status');
const resultDiv = document.getElementById('result');
const sidePanelId = 'sidePanel';
const colors = {
    gold: 'gold',
    gray: 'gray',
    red: 'red',
    transparent: 'transparent',
    favoriteBg: '#ff4d4d',
    unfavoriteBg: '#333',
    panelBg: '#1a1a1a',
    panelText: '#f0f0f0',
    panelBorder: '#333',
    panelInputBg: '#2a2a2a'
};

const existingTitles = [

];

document.getElementById('searchInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') initiateSearch();
});


function initiateSearch() {
    const searchValue = document.getElementById('searchInput').value.trim();
    if (!searchValue) return;

    const { text, extractedType } = extractSearchDetails(searchValue);

    if (titleExists(text, extractedType)) {
        showStatus('Title Already Exists', colors.red, true);
        return;
    }

    existingTitles.push({ title: text, type: extractedType });
    showStatus('Fetching image...', '', false);

    const newSearchValue = (text + " " + extractedType).trim();
    window.api.sendSearch(newSearchValue);
    document.getElementById('searchInput').value = '';
}

function extractSearchDetails(searchValue) {
    const regex = /`(.*?)`/g;
    const match = searchValue.match(regex);
    const text = searchValue.replace(regex, '').trim();
    const extractedType = match ? match.map(item => item.replace(/`/g, '')).join(' ') : "";
    return { text, extractedType };
}

function titleExists(title, type) {
    return existingTitles.some(item => {
        const existingTitle = item.title.toLowerCase();
        const existingType = (item.type || '').toLowerCase();
        const inputTitle = title.toLowerCase();
        const inputType = (type || '').toLowerCase();

        return existingTitle === inputTitle && existingType === inputType;
    });
}


function showStatus(message, color, shake) {
    statusElement.textContent = message;
    statusElement.style.color = color;
    if (shake) {
        statusElement.classList.add('shake');
        setTimeout(() => statusElement.classList.remove('shake'), 1000);
    }
}

function toCamelCase(string) {
    return string
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

window.api.onImageResult((imageUrl, searchValue) => {
    searchValue = searchValue.trim();
    const cleanTitle = toCamelCase(searchValue.replace(/`(.*?)`/g, '').trim());

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
    tile.style.animation = 'fadeIn 0.5s ease-in-out';

    const img = document.createElement('img');
    img.src = imageUrl;
    img.setAttribute('draggable', 'false');

    const titleDiv = document.createElement('div');
    titleDiv.className = 'tile-title';
    titleDiv.textContent = title;

    const description = document.createElement('div');
    description.className = 'description';

    const rating = createRating(0);

    const heartIcon = document.createElement('div');
    heartIcon.className = 'heart-icon';
    heartIcon.textContent = '❤️';
    heartIcon.style.color = colors.transparent;

    img.addEventListener('dblclick', () => {
        toggleFavorite(heartIcon, tile);
        if (currentPanelTile === tile) updatePanel();
    });

    tile.addEventListener('click', () => {
        currentPanelTile = tile;
        showSidePanel(tile, title, imageUrl, rating);
    });

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
        star.style.color = i <= initialRating ? colors.gold : colors.gray;
        star.addEventListener('click', () => {
            updateRating(rating, i);
            if (currentPanelTile) updatePanel();
        });
        rating.appendChild(star);
    }
    return rating;
}

function updateRating(ratingElement, ratingValue) {
    const stars = ratingElement.querySelectorAll('span');
    stars.forEach((star, index) => {
        star.style.color = index < ratingValue ? colors.gold : colors.gray;
    });
}

function toggleFavorite(heartIcon, tile) {
    const isFavorited = heartIcon.style.color === colors.red;
    heartIcon.style.color = isFavorited ? colors.transparent : colors.red;
    if (currentPanelTile === tile) updatePanel();
}

function showSidePanel(tile, title, imageUrl, tileRating) {
    let sidePanel = document.getElementById(sidePanelId);
    if (!sidePanel) {
        sidePanel = document.createElement('div');
        sidePanel.id = sidePanelId;
        sidePanel.style.cssText = `
            position: fixed;
            top: 0;
            right: 0;
            width: 300px;
            height: 100%;
            background: ${colors.panelBg};
            color: ${colors.panelText};
            padding: 20px;
            box-shadow: -4px 0 10px rgba(0, 0, 0, 0.5);
            z-index: 1000;
            display: flex;
            flex-direction: column;
            gap: 15px;
            transform: translateX(100%);
            opacity: 0;
            transition: transform 0.3s ease, opacity 0.3s ease;
        `;
        document.body.appendChild(sidePanel);
    }

    sidePanel.innerHTML = `
        <div style="display: flex; justify-content: center; align-items: center;">
            <h3 style="margin: 0;">Edit</h3>
            <button id="closePanel" style="
                background: none;
                border: none;
                color: ${colors.panelText};
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
                border: 1px solid ${colors.panelBorder};
                border-radius: 4px;
                background: ${colors.panelInputBg};
                color: ${colors.panelText};
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
                background: ${tile.querySelector('.heart-icon').style.color === colors.red ? colors.favoriteBg : colors.unfavoriteBg};
                color: ${colors.panelText};
                cursor: pointer;">
                ${tile.querySelector('.heart-icon').style.color === colors.red ? 'Unfavorite' : 'Favorite'}
            </button>
        </div>
    `;

    document.getElementById('closePanel').addEventListener('click', () => {
        sidePanel.style.transform = 'translateX(100%)';
        sidePanel.style.opacity = '0';
        currentPanelTile = null;
    });

    document.getElementById('panelTitle').addEventListener('input', (e) => {
        tile.querySelector('.tile-title').textContent = e.target.value;
    });

    document.getElementById('panelFavorite').addEventListener('click', (e) => {
        const heartIcon = tile.querySelector('.heart-icon');
        toggleFavorite(heartIcon, tile);
        e.target.textContent = heartIcon.style.color === colors.red ? 'Unfavorite' : 'Favorite';
        e.target.style.background = heartIcon.style.color === colors.red ? colors.favoriteBg : colors.unfavoriteBg;
    });

    const panelRating = document.getElementById('panelRating');
    panelRating.innerHTML = '';

    const currentRating = Array.from(tileRating.querySelectorAll('span')).filter(star => star.style.color === colors.gold).length;

    for (let i = 1; i <= 5; i++) {
        const star = document.createElement('span');
        star.textContent = '★';
        star.dataset.rating = i;
        star.style.color = i <= currentRating ? colors.gold : colors.gray;
        star.addEventListener('click', () => {
            updateRating(panelRating, i);
            updateRating(tileRating, i);
        });
        panelRating.appendChild(star);
    }

    sidePanel.style.transform = 'translateX(0)';
    sidePanel.style.opacity = '1';
    sidePanel.style.display = 'flex';
}

function updatePanel() {
    if (!currentPanelTile) return;
    updateFavoriteButton(currentPanelTile.querySelector('.heart-icon'));
}

function updateFavoriteButton(heartIcon) {
    const isFavorited = heartIcon.style.color === colors.red;
    const panelFavoriteButton = document.getElementById('panelFavorite');
    panelFavoriteButton.textContent = isFavorited ? 'Unfavorite' : 'Favorite';
    panelFavoriteButton.style.background = isFavorited ? colors.favoriteBg : colors.unfavoriteBg;
}

addShakeAnimationCSS();

function addShakeAnimationCSS() {
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
}

// TODO: Add a way to remove tiles
// TODO: Add differnt border colors for different types (create a random color for every new type)
// TODO: image regeneration
// TODO: Differentiate between title and type
// TODO: Add tags + notes
// TODO: save/load
// TODO: bulk add / queue
// TODO: hide/show image (blur)
// TODO: whenever i edit the title, the existingTitles array should be updated with a new coloumn

import { initiateSearch } from "./components/searchbar.js";
import Tile from "./components/tile.js";

const statusElement = document.querySelector('.status');
const resultDiv = document.getElementById('result');

document.getElementById('searchInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') initiateSearch();
});

window.api.onImageResult((imageUrl, searchValue) => {
    searchValue = searchValue.trim();
    const cleanTitle = toCamelCase(searchValue.replace(/`(.*?)`/g, '').trim());

    if (imageUrl) {
        const tile = new Tile(cleanTitle, imageUrl);
        const tileElement = tile.createTile();
        resultDiv.appendChild(tileElement);
        statusElement.textContent = 'Image fetched successfully.';
    } else {
        statusElement.textContent = 'No image found.';
    }
});

function toCamelCase(string) {
    return string
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

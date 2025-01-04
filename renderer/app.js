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

// -------------- Test Cases ---------------
const testTile = new Tile('Pixel Neon City', 'https://easy-peasy.ai/cdn-cgi/image/quality=80,format=auto,width=700/https://fdczvxmwwjwpwbeeqcth.supabase.co/storage/v1/object/public/images/0101d07e-d041-4233-8471-cae03c03f6d3/7c4d1f95-b28c-4668-b593-a9deb5542dcc.png');
const testTileElement = testTile.createTile();
resultDiv.appendChild(testTileElement);

const testTile2 = new Tile('Sunrise', 'https://thumbs.dreamstime.com/b/sunset-sunrise-ocean-nature-landscape-background-pink-clouds-evening-morning-view-pixel-art-illustration-flying-sky-to-296799909.jpg')
const testTileElement2 = testTile2.createTile();
resultDiv.appendChild(testTileElement2);
// -----------------------------------------

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

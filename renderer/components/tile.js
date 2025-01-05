import SidePanel from "./sidepanel.js";
import { colors } from "./constants.js";

let currentSidePanel = null;
let currentPanelTile = null;

class Tile {
    constructor(title, imageUrl) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.isFavorite = false;
        this.rating = 0;
        this.tileElement = null;
        this.sidePanelInstance = null;
    }

    createTile() {
        this.tileElement = this.createElement('div', { className: 'tile', style: 'animation: fadeIn 0.5s ease-in-out;' });

        const img = this.createElement('img', { className: 'tile-image', src: this.imageUrl, draggable: 'false' });
        const titleDiv = this.createElement('div', { className: 'tile-title', textContent: this.title });
        const description = this.createElement('div', { className: 'description' });
        const title = this.createElement('div', { className: 'main-tile-title', textContent: this.title });
        const rating = this.createRating();
        const heartIcon = this.createHeartIcon();

        this.setupTileEvents(this.tileElement, img, heartIcon, rating);

        description.append(titleDiv, rating);
        this.tileElement.append(img, description, heartIcon, title);
        return this.tileElement;
    }

    createElement(tag, attributes = {}) {
        const element = document.createElement(tag);
        Object.assign(element, attributes);
        return element;
    }

    createHeartIcon() {
        const heartIcon = this.createElement('div', { className: 'heart-icon', textContent: '❤️', style: 'color: transparent;' });
        heartIcon.addEventListener('click', () => this.toggleFavorite(heartIcon));
        return heartIcon;
    }

    createRating() {
        const rating = this.createElement('div', { className: 'rating' });
        for (let i = 1; i <= 5; i++) {
            const star = this.createElement('span', { textContent: '★' });
            star.dataset.rating = i;
            star.style.color = i <= this.rating ? colors.gold : colors.gray;
            star.addEventListener('click', () => this.updateRating(rating, i));
            rating.appendChild(star);
        }
        return rating;
    }

    setupTileEvents(tile, img, heartIcon, rating) {
        tile.addEventListener('click', () => {
            currentPanelTile = tile;

            if (currentSidePanel && currentSidePanel !== this.sidePanelInstance) {
                currentSidePanel.panel.style.transform = 'translateX(100%)';
                currentSidePanel.panel.style.opacity = '0';
            }

            if (!this.sidePanelInstance) {
                this.sidePanelInstance = new SidePanel(this.tileElement, this.title, this.imageUrl, rating);
            }

            currentSidePanel = this.sidePanelInstance;
            this.sidePanelInstance.showSidePanel();
        });
    }

    updateRating(ratingElement, ratingValue) {
        this.rating = ratingValue;
        this.updateRatingDisplay(ratingElement);
        if (currentPanelTile) this.updatePanel();
    }

    updateRatingDisplay(ratingElement) {
        const stars = ratingElement.querySelectorAll('span');
        stars.forEach((star, index) => {
            star.style.color = index < this.rating ? colors.gold : colors.gray;
        });
    }

    toggleFavorite(heartIcon) {
        this.isFavorite = !this.isFavorite;
        heartIcon.style.color = this.isFavorite ? colors.red : colors.transparent;
        if (currentPanelTile === heartIcon.closest('.tile')) this.updatePanel();
    }

    updatePanel() {
        if (!currentPanelTile) return;
        const heartIcon = currentPanelTile.querySelector('.heart-icon');
        this.updateFavoriteButton(heartIcon);
    }

    updateFavoriteButton(heartIcon) {
        const isFavorited = heartIcon.style.color === colors.red;
        const panelFavoriteButton = document.getElementById('panelFavorite');
        panelFavoriteButton.textContent = isFavorited ? 'Unfavorite' : 'Favorite';
        panelFavoriteButton.style.background = isFavorited ? colors.favoriteBg : colors.unfavoriteBg;
    }
}

export default Tile;

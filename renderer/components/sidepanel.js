import { colors } from "./constants.js";  

class SidePanel {
    constructor(tile) {
        this.tile = tile; // Reference to the tile associated with this side panel
        this.panel = null;
        this.panelId = 'sidePanel';
    }

    showSidePanel() {
        if (!this.panel) {
            this.createPanel();
        }

        const titleElement = this.tile.querySelector('.tile-title');
        const heartIcon = this.tile.querySelector('.heart-icon');
        const tileRating = this.tile.querySelector('.rating');
        
        // Set initial values for the panel
        this.panel.querySelector('#panelTitle').value = titleElement.textContent;
        this.panel.querySelector('#panelFavorite').textContent = heartIcon.style.color === colors.red ? 'Unfavorite' : 'Favorite';
        this.panel.querySelector('#panelFavorite').style.background = heartIcon.style.color === colors.red ? colors.favoriteBg : colors.unfavoriteBg;

        // Set the rating stars
        this.updateRatingStars(tileRating);

        // Show the side panel
        this.panel.style.transform = 'translateX(0)';
        this.panel.style.opacity = '1';
    }

    createPanel() {
        this.panel = document.createElement('div');
        this.panel.id = this.panelId;
        this.panel.style.cssText = `
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
        document.body.appendChild(this.panel);

        this.panel.innerHTML = `
            <div style="display: flex; justify-content: center; align-items: center;">
                <h3 style="margin: 0;">Edit</h3>
                <button id="closePanel" style="position: absolute; right: 20px; background: none; border: none; color: ${colors.panelText}; font-size: 18px; cursor: pointer;">✖</button>
            </div>
            <div style="margin-top: 20px;">
                <label style="display: block; margin-bottom: 5px;">Title:</label>
                <input type="text" id="panelTitle" style="width: 100%; padding: 5px; border: 1px solid ${colors.panelBorder}; border-radius: 4px; background: ${colors.panelInputBg}; color: ${colors.panelText}; outline: none;">
            </div>
            <div style="margin-top: 20px;">
                <label style="display: block; margin-bottom: 5px;">Rating:</label>
                <div id="panelRating" class="rating"></div>
            </div>
            <div style="margin-top: 20px;">
                <label style="display: inline-block; margin-bottom: 5px; margin-right: 10px;">Favorite:</label>
                <button id="panelFavorite" style="padding: 5px 10px; border: none; border-radius: 4px; cursor: pointer;"></button>
            </div>
            <div style="margin-top: 20px; text-align: center;">
                <button id="deleteTile" style="padding: 10px 15px; border: none; border-radius: 4px; background: ${colors.red}; color: white; cursor: pointer;">Delete Tile</button>
            </div>
        `;

        // Close panel handler
        this.panel.querySelector('#closePanel').addEventListener('click', () => {
            this.panel.style.transform = 'translateX(100%)';
            this.panel.style.opacity = '0';
        });

        // Title input handler
        this.panel.querySelector('#panelTitle').addEventListener('input', (e) => {
            this.tile.querySelector('.tile-title').textContent = e.target.value;
        });

        // Favorite button handler
        this.panel.querySelector('#panelFavorite').addEventListener('click', (e) => {
            const heartIcon = this.tile.querySelector('.heart-icon');
            this.toggleFavorite(heartIcon, e.target);
        });

        // Delete tile handler
        this.panel.querySelector('#deleteTile').addEventListener('click', () => {
            this.deleteTile();
            this.panel.style.transform = 'translateX(100%)';
            this.panel.style.opacity = '0';
        });
    }

    updateRatingStars(tileRating) {
        const panelRating = this.panel.querySelector('#panelRating');
        panelRating.innerHTML = '';

        const currentRating = Array.from(tileRating.querySelectorAll('span')).filter(star => star.style.color === colors.gold).length;

        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('span');
            star.textContent = '★';
            star.dataset.rating = i;
            star.style.color = i <= currentRating ? colors.gold : colors.gray;
            star.addEventListener('click', () => {
                this.updateRating(panelRating, i);
                this.updateRating(tileRating, i);
            });
            panelRating.appendChild(star);
        }
    }

    updateRating(ratingElement, ratingValue) {
        const stars = ratingElement.querySelectorAll('span');
        stars.forEach((star, index) => {
            star.style.color = index < ratingValue ? colors.gold : colors.gray;
        });
    }

    toggleFavorite(heartIcon, button) {
        const isFavorite = heartIcon.style.color === colors.red;
        heartIcon.style.color = isFavorite ? colors.transparent : colors.red;
        button.textContent = isFavorite ? 'Favorite' : 'Unfavorite';
        button.style.background = isFavorite ? colors.unfavoriteBg : colors.favoriteBg;
    }
}

export default SidePanel;

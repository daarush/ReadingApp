import { colors } from "./constants.js";  

class SidePanel {
    constructor(tile) {
        this.tile = tile; // Reference to the tile associated with this side panel
        this.panel = null;
        this.panelId = 'sidePanel';
        this.isPanelOpen = false;  // Track if the panel is open
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
        this.panel.querySelector('#panelFavorite').textContent = heartIcon.style.color === colors.red ? '❤️ Favorited' : '❤️ Favorite';
        this.panel.querySelector('#panelFavorite').style.background = heartIcon.style.color === colors.red ? colors.favoriteBg : colors.unfavoriteBg;

        // Set the rating stars
        this.updateRatingStars(tileRating);

        // Show the side panel
        this.panel.style.transform = 'translateX(0)';
        this.panel.style.opacity = '1';
        this.isPanelOpen = true;  // Set the panel as open

        // Enable mouse move tracking for parallax effect
        this.addMouseMoveEffect();
    }

    createPanel() {
        this.panel = document.createElement('div');
        this.panel.id = this.panelId;
        document.body.appendChild(this.panel);

        this.panel.innerHTML = `
            <div style="display: flex; justify-content: center; align-items: center;">
            <h3 style="margin: 0;">Edit</h3>
            <button id="closePanel" style="position: absolute; right: 20px; background: none; border: none; color: ${colors.panelText}; font-size: 18px; cursor: pointer;">✖</button>
            </div>
            <div class="parallax-container">
            <img src="${this.tile.querySelector('img').src}" class="parallax-img" style="width: 100%; margin-top: 20px;">
            </div>
            <div style="margin-top: 20px;">
            <input type="text" id="panelTitle" style="width: 100%; padding: 5px; border: 1px solid ${colors.panelBorder}; border-radius: 4px; background: ${colors.panelInputBg}; color: ${colors.panelText}; outline: none;">
            </div>
            <div style="margin-top: 20px;">
            <button id="panelFavorite"></button>
            </div>
            <div style="margin-top: 20px; display: flex; justify-content: center; align-items: flex-end; height: 20px;">
            <label style="margin-top: 10px;">Rating: </label>
            <div id="panelRating" class="rating"></div>
            </div>
            <div style="margin-top: 20px; text-align: center;">
            <button id="deleteTile" style="padding: 10px 15px; border: none; border-radius: 4px; background: ${colors.red}; color: white; cursor: pointer;">Delete Tile</button>
            </div>
        `;

        // Close panel handler
        this.panel.querySelector('#closePanel').addEventListener('click', () => {
            this.panel.style.transform = 'translateX(100%)';
            this.panel.style.opacity = '0';
            this.isPanelOpen = false;  // Set the panel as closed
            this.removeMouseMoveEffect();
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
            this.isPanelOpen = false;  // Set the panel as closed
            this.removeMouseMoveEffect();
        });
    }

    addMouseMoveEffect() {
        const parallaxImage = this.panel.querySelector('.parallax-img');

        // Apply mouse movement 3D tilt effect
        window.addEventListener('mousemove', this.applyParallaxEffect.bind(this, parallaxImage));
    }

    removeMouseMoveEffect() {
        // Remove mousemove listener when the panel is closed
        window.removeEventListener('mousemove', this.applyParallaxEffect);
    }

    applyParallaxEffect(parallaxImage, e) {
        // Check if the panel is open before applying the effect
        if (!this.isPanelOpen) return;

        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        // Get mouse position relative to the window's center
        const mouseX = (e.clientX - windowWidth / 2) / (windowWidth / 2);
        const mouseY = (e.clientY - windowHeight / 2) / (windowHeight / 2);

        // Adjust tilt strength (feel free to tweak these values)
        const tiltStrength = 10;  // The strength of the tilt
        const tiltX = mouseY * tiltStrength;  // Vertical tilt
        const tiltY = mouseX * tiltStrength;  // Horizontal tilt

        // Clamp the tilt values to avoid extreme rotation
        const maxTilt = tiltStrength*2; // Maximum tilt in degrees
        const clampedTiltX = Math.min(Math.max(tiltX, -maxTilt), maxTilt);
        const clampedTiltY = Math.min(Math.max(tiltY, -maxTilt), maxTilt);

        // Apply the tilt effect on the image with subtle 3D transformation
        parallaxImage.style.transform = `rotateX(${clampedTiltX}deg) rotateY(${clampedTiltY}deg)`;
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
        button.textContent = isFavorite ? '❤️ Favorite' : '❤️ Favorited';
        button.style.background = isFavorite ? colors.unfavoriteBg : colors.favoriteBg;
        button.style.background = isFavorite ? colors.unfavoriteBg : colors.favoriteBg;
    }

    deleteTile() {
        this.panel.remove();
        this.tile.remove();
    }
}

export default SidePanel;

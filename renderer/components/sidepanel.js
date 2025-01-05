import { colors } from "./constants.js";  
import { showStatus } from "./statusbar.js";

class SidePanel {
    constructor(tile) {
        this.tile = tile;
        this.panel = null;
        this.panelId = 'sidePanel';
        this.isPanelOpen = false;
    }

    showSidePanel() {
        if (!this.panel) this.createPanel();

        const titleElement = this.tile.querySelector('.tile-title');
        const heartIcon = this.tile.querySelector('.heart-icon');
        const tileRating = this.tile.querySelector('.rating');

        this.panel.querySelector('#panelTitle').value = titleElement.textContent;
        this.panel.querySelector('#panelFavorite').textContent = heartIcon.style.color === colors.red ? '❤️ Favorited' : '❤️ Favorite';
        this.panel.querySelector('#panelFavorite').style.background = heartIcon.style.color === colors.red ? colors.favoriteBg : colors.unfavoriteBg;

        this.updateRatingStars(tileRating);

        this.panel.style.transform = 'translateX(0)';
        this.panel.style.opacity = '1';
        this.isPanelOpen = true;

        this.addMouseMoveEffect();
        showStatus('Side panel opened');
    }

    createPanel() {
        this.panel = document.createElement('div');
        this.panel.id = this.panelId;
        document.body.appendChild(this.panel);

        this.panel.innerHTML = `
            <div id="panelHeader">
                <h3>Edit</h3>
                <button id="closePanel">✖</button>
            </div>
            <div class="parallax-container">
                <img src="${this.tile.querySelector('img').src}" class="parallax-img">
            </div>
            <div id="panelImageManager">
                <button id="regenImage">Find New Image</button>
                <button id="toggleImage">Hide Image</button>
            </div>
            <div style="margin-top: 20px;">
                <input type="text" id="panelTitle">
            </div>
            <div style="margin-top: 20px;">
                <button id="panelFavorite"></button>
            </div>
            <div id="panelRatingContainer">
                <label id="panelRatingLabel">Rating: </label>
                <div id="panelRating" class="rating"></div>
            </div>
            <div id="panelTagsContainer">
                <div id="panelTagsInputContainer">
                    <label id="panelTagsLabel">Tags: </label>
                    <div id="panelTagsInput" contenteditable="true"></div>
                </div>
                <div id="panelTags"></div>
            </div>
            <div id="panelNotesContainer">
                <label id="panelNotesLabel">Notes: </label>
                <div id="panelNotes" contenteditable="true"></div>
            </div>
            <div style="margin-top: 20px; text-align: center; padding-bottom: 20px;">
                <button id="deleteTile">Delete</button>
            </div>
        `;

        this.panel.querySelector('#regenImage').addEventListener('click', () => this.regenerateImage());
        this.panel.querySelector('#toggleImage').addEventListener('click', () => this.toggleImage());
        this.panel.querySelector('#closePanel').addEventListener('click', () => this.closePanel());
        this.panel.querySelector('#panelTitle').addEventListener('input', (e) => {
            this.tile.querySelector('.tile-title').textContent = e.target.value;
            showStatus('Title updated');
        });
        this.panel.querySelector('#panelFavorite').addEventListener('click', (e) => {
            const heartIcon = this.tile.querySelector('.heart-icon');
            this.toggleFavorite(heartIcon, e.target);
            showStatus('Favorite status toggled');
        });
        this.panel.querySelector('#deleteTile').addEventListener('click', () => this.deleteTile());
        this.panel.querySelector('#panelTagsInput').addEventListener('keydown', (e) => this.manageTags(e));
    }

    regenerateImage() {}

    toggleImage() {
        const image = this.panel.querySelector('.parallax-img');
        image.classList.toggle('hide');
        this.panel.querySelector('#toggleImage').textContent = image.classList.contains('hide') ? 'Show Image' : 'Hide Image';
        this.tile.querySelector('img').classList.toggle('hide');
        showStatus('Image visibility toggled');
    }

    closePanel() {
        this.panel.style.transform = 'translateX(100%)';
        this.panel.style.opacity = '0';
        this.isPanelOpen = false;
        this.removeMouseMoveEffect();
        showStatus('Side panel closed');
    }

    addMouseMoveEffect() {
        const parallaxImage = this.panel.querySelector('.parallax-img');
        window.addEventListener('mousemove', this.applyParallaxEffect.bind(this, parallaxImage));
    }

    removeMouseMoveEffect() {
        window.removeEventListener('mousemove', this.applyParallaxEffect);
    }

    applyParallaxEffect(parallaxImage, e) {
        if (!this.isPanelOpen) return;

        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        const mouseX = (e.clientX - windowWidth / 2) / (windowWidth / 2);
        const mouseY = (e.clientY - windowHeight / 2) / (windowHeight / 2);

        const tiltStrength = 10;
        const tiltX = mouseY * tiltStrength;
        const tiltY = mouseX * tiltStrength;

        const maxTilt = tiltStrength * 2;
        const clampedTiltX = Math.min(Math.max(tiltX, -maxTilt), maxTilt);
        const clampedTiltY = Math.min(Math.max(tiltY, -maxTilt), maxTilt);

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
        showStatus('Rating updated');
    }

    toggleFavorite(heartIcon, button) {
        const isFavorite = heartIcon.style.color === colors.red;
        heartIcon.style.color = isFavorite ? colors.transparent : colors.red;
        button.textContent = isFavorite ? '❤️ Favorite' : '❤️ Favorited';
        button.style.background = isFavorite ? colors.unfavoriteBg : colors.favoriteBg;
        showStatus('Favorite status toggled');
    }

    deleteTile() {
        this.panel.remove();
        this.tile.remove();
        showStatus('Tile deleted');
    }

    manageTags(e) {
        if (e.code === "Enter" || e.code === "Tab") {
            e.preventDefault();
            let tagName = e.target.textContent.trim();
            if (tagName.length) {
                const tagElement = this.createElement('span', { textContent: tagName, className: 'tag' });

                const removeTagButton = this.createElement('span', { textContent: 'x', className: 'remove-tag' });
                removeTagButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    tagElement.classList.add('removing');
                    setTimeout(() => {
                        tagElement.remove();
                        showStatus('Tag removed');
                    }, 300);
                });

                tagElement.addEventListener('mouseover', () => {
                    if (!tagElement.contains(removeTagButton)) {
                        tagElement.appendChild(removeTagButton);
                    }
                });

                const handleMouseOut = () => {
                    if (!tagElement.matches(':hover') && !removeTagButton.matches(':hover')) {
                        tagElement.removeChild(removeTagButton);
                    }
                };

                tagElement.addEventListener('mouseout', handleMouseOut);
                removeTagButton.addEventListener('mouseout', handleMouseOut);

                this.panel.querySelector('#panelTags').appendChild(tagElement);
                e.target.textContent = '';
                showStatus('Tag added');
            }
        }
    }

    createElement(tag, attributes) {
        const element = document.createElement(tag);
        for (let key in attributes) {
            element[key] = attributes[key];
        }
        return element;
    }
}

export default SidePanel;

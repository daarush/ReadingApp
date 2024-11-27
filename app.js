document.getElementById('searchButton').addEventListener('click', () => {
    const searchValue = document.getElementById('searchInput').value;
    window.api.sendSearch(searchValue); // Use the exposed API to send the search term
});

window.api.onImageResult((imageUrl) => {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = ''; // Clear previous results
    if (imageUrl) {
        const img = document.createElement('img');
        img.src = imageUrl;
        img.style.width = '100px'; // Set width to maximum
        resultDiv.appendChild(img);
    } else {
        resultDiv.textContent = 'No image found.';
    }
});

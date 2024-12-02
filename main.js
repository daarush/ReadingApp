const { app, BrowserWindow, ipcMain } = require('electron');
const puppeteer = require('puppeteer');
const path = require('path');

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            enableRemoteModule: false,
            nodeIntegration: false 
        },
        autoHideMenuBar: true
    });

    win.loadFile('index.html');
}

app.whenReady().then(createWindow);

ipcMain.on('search-images', async (event, searchValue) => {
  try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      // Use the new URL format, replacing spaces with '+' for the search term
      var newSearchValue = searchValue + " cover art";
      const url = `https://duckduckgo.com/?q=${newSearchValue.replaceAll(" ", "+")}&va=b&t=hc&iar=images&iax=images&ia=images`;

      await page.goto(url, { waitUntil: 'networkidle2' });
      await page.waitForSelector('img');

      const firstImageSource = await page.evaluate(() => {
          // Get all image elements
          const images = Array.from(document.querySelectorAll('img'))
          // Return the source of the first valid image found
          return images.length > 0 ? images[0].src : null;
      });

      await browser.close();

      event.reply('image-result', { imageUrl: firstImageSource, searchValue });
  } catch (error) {
      console.error("Error during Puppeteer operation:", error);
  }
});




app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

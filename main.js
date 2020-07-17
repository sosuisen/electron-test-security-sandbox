const {app, BrowserWindow, ipcMain} = require('electron')
const url = require('url');
const path = require('path');

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('ready', function () {
  const cardWindow = new BrowserWindow({
    width: 900,
    height: 900,
    webPreferences: {
    }
  })

  const indexUrl = url.format({
            pathname: path.join(__dirname, 'index.html'),
            protocol: 'file:',
            slashes: true,
          });
  cardWindow.loadURL(indexUrl);
  // Open the DevTools.
  cardWindow.webContents.openDevTools();
  cardWindow.show();

  cardWindow.webContents.on('will-navigate', (event, url) => {
    // block page transition
    const prevUrl = indexUrl.replace(/\\/g,'/');
    if (url === prevUrl) {
      console.info('reload() is not permitted');
      event.preventDefault();
    }
    else {
      console.error('Page navigation is not permitted.');
      event.preventDefault();
    }
  })
});


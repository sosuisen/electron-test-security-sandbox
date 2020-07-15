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

  cardWindow.loadURL(
          url.format({
            pathname: path.join(__dirname, 'index.html'),
            protocol: 'file:',
            slashes: true,
          })
        );
  // Open the DevTools.
  cardWindow.webContents.openDevTools();
  cardWindow.show();
});

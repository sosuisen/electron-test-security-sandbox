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


  cardWindow.webContents.on('did-finish-load', () => {
    const checkNavigation = (event, url) => {
      console.info('did-start-navigate : ' + url);
      const isTopFrame = /index*\.html$/.test(url);
      if(isTopFrame){
        // Top frame is reloaded
        cardWindow.webContents.off('did-start-navigation', checkNavigation);
        return;
      }

      const isValid = /frame.*\.html$/.test(url);
      if(isValid){
        console.info('did-start-navigate to valid : ' + url);
        // When iframe is reloaded, cardWindow must be also reloaded not to apply tampered sandbox attributes to iframe.
        cardWindow.webContents.off('did-start-navigation', checkNavigation);
        cardWindow.reload();
      }
      else{
        console.info('did-start-navigate to invalid : ' + url);
        cardWindow.webContents.off('did-start-navigation', checkNavigation);
        cardWindow.reload();
      }
      
    };
    console.info('did-finish-load');
    cardWindow.webContents.on('did-start-navigation', checkNavigation);    
  });

  cardWindow.webContents.on('will-navigate', (event, url) => {
    // block page transition
    const prevUrl = indexUrl.replace(/\\/g,'/');
    if (url === prevUrl) {
      console.info('reload() is permitted');
    }
    else {
      console.error('Page navigation is not permitted.');
      event.preventDefault();
    }
  })
  
});


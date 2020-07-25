const {app, dialog, BrowserWindow, ipcMain} = require('electron')
const url = require('url');
const path = require('path');

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

const showMessage = (window, title, txt) => {
  txt = txt.substr(0,50) + '\n' + txt.substr(50, 50) + '\n' + txt.substr(100, 50) + '\n' + txt.substr(150, 50) + '\n' + txt.substr(200);
  dialog.showMessageBoxSync(window, {
      type: 'question',
      buttons: ['OK'],
      message: title,
      detail: txt,
    });
};


const createNewWindow = (startFileName, options) => {
  const cardWindow = new BrowserWindow({
    width: 900,
    height: 900,
    webPreferences: {
    }
  });

  const indexUrl = url.format({
            pathname: path.join(__dirname, startFileName),
            protocol: 'file:',
            slashes: true,
          });
  cardWindow.loadURL(indexUrl);
  // Open the DevTools.
  cardWindow.webContents.openDevTools();
  cardWindow.show();


  if(/allow-navigation/.test(options)){
    return;
  }

  cardWindow.webContents.on('did-finish-load', () => {
    const checkNavigation = (event, url) => {
      console.info('did-start-navigate : ' + url);

      // Check top frame
      // Install: file://C:/Users/{User Name}/AppData/Local/electron-test-security-sandbox/app-1.0.0/resources/app/index.html
      // Develop: file://{Any}/electron-test-security-sandbox/index.html
      const topFrameURL = indexUrl.replace(/\\/g,'/');
      if(url === topFrameURL){
        // Top frame is reloaded
        cardWindow.webContents.off('did-start-navigation', checkNavigation);
        showMessage(cardWindow, 'OK', 'Top frame is reloaded.');        
        return;
      }

      // Check iframe
      const iframeRex = new RegExp(topFrameURL.replace(/index.html$/, 'frame.*html$'));
      const isValid = iframeRex.test(url);
      console.info('regexp : ' + iframeRex.source);
      if(isValid){
        console.info('did-start-navigate to valid : ' + url);
        // When iframe is reloaded, cardWindow must be also reloaded not to apply tampered sandbox attributes to iframe.
        cardWindow.webContents.off('did-start-navigation', checkNavigation);
        showMessage(cardWindow, 'Valid', 'Navigate to valid url: ' + url);
        cardWindow.reload();
      }
      else{
        console.info('did-start-navigate to invalid : ' + url);
        cardWindow.webContents.off('did-start-navigation', checkNavigation);
        showMessage(cardWindow, 'Invalid', 'Navigate to *invalid* url: ' + url);
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
      console.info('reload() in top frame is permitted');
    }
    else {
      console.error('Page navigation in top frame is not permitted.');
      showMessage(cardWindow, 'Cancel', 'Page navigate in top frame is not permitted.');
      event.preventDefault();
    }
  })
}; 

app.on('ready', function () {
  createNewWindow('index.html', '');
  createNewWindow('index2.html', 'allow-navigation');
});

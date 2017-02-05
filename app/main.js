const {BrowserWindow, app, ipcMain} = require('electron');
const path = require('path');

// Get the window up and running
app.on('ready', function() {
    let appWindow = new BrowserWindow({backgroundColor: '#fafafa'});
    appWindow.loadURL('file://' + __dirname + '/index.html');
    appWindow.on('closed', function() {
        mainWindow = null;
    });
});
app.on('window-all-closed', function() {
    if (process.platform != 'darwin') {
        app.quit();
    }
});

let config_path = path.join(process.env.HOME, '.config', 'elecal');
ipcMain.on('getConfigDir', (event, arg) => {
  event.returnValue = config_path;
});

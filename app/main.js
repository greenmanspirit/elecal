const {BrowserWindow, app} = require('electron');

app.on('ready', () => {
    let appWindow = new BrowserWindow({show: false});
    appWindow.once('ready-to-show', () => {
        appWindow.show();
    });
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

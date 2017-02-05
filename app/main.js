const {BrowserWindow, app} = require('electron');

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

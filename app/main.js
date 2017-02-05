const {BrowserWindow, app, ipcMain, Menu} = require('electron');
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

let menuTemplate = [
  {
    label: 'File',
    submenu: [
      {role: 'quit'}
    ]
  },
  {
    label: 'Edit',
    submenu: [
      {role: 'undo'},
      {role: 'redo'},
      {role: 'cut'},
      {role: 'copy'},
      {role: 'paste'},
      {role: 'separator'},
      {
        label: 'Accounts',
        click(item, focusedWindow) {
          if(focusedWindow) focusedWindow.webContents.send('showAccounts');
        }
      }
    ]
  },
  {
    label: 'View',
    submenu: [
      {
        label: 'Reload',
        accelerator: 'CmdOrCtrl+R',
        click (item, focusedWindow) {
          if (focusedWindow) focusedWindow.reload();
        }
      },
      {
        label: 'Toggle Developer Tools',
        accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
        click (item, focusedWindow) {
          if(focusedWindow) focusedWindow.webContents.toggleDevTools();
        }
      },
      {type: 'separator'},
      {role: 'togglefullscreen'}
    ]
  }
];

const menu = Menu.buildFromTemplate(menuTemplate)
Menu.setApplicationMenu(menu)

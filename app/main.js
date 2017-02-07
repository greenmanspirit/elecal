/*
 * This script contains the code for the Electron Main process.
 */

/*
 * Imports
 */
const {BrowserWindow, app, ipcMain, Menu} = require('electron');
const ipc = ipcMain;
const path = require('path');
const fs = require('fs');

/*
 * Config file management
 */
// Create the config directory path. I prefer .config to having a .elecal in
//   the users home directory because home directories can become overwhelmed
//   with app dirs.
let config_path = path.join(process.env.HOME, '.config', 'elecal');

// This ipc event passes the config_path to the Renderer process. This is here
//   because process.env.HOME does not exist in the Renderer process.
ipc.on('getConfigDir', (event, arg) => {
  event.returnValue = config_path;
}); //ipc.on

// Check to see if the config_path exists
fs.access(config_path, fs.constants.R_OK | fs.constants.W_OK, function(err) {
  // If there is an error, try creating the config_path
  if(err) {
    fs.mkdirSync(config_path, 0o700);
  }
}); //fs.access

/*
 * Window management
 */
// create and load the BrowserWindow when the app is ready
app.on('ready', function() {
  let appWindow = new BrowserWindow({backgroundColor: '#fafafa'});
  appWindow.loadURL('file://' + __dirname + '/index.html');
}); //app.on 'ready'

// When all windows are closed (in this case there is just one) quit the app
app.on('window-all-closed', function() {
  app.quit();
}); //app.on 'window-all-closed'

/*
 * Menu management
 */
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
      {type: 'separator'},
      {
        label: 'Accounts',
        click(item, focusedWindow) {
          if(focusedWindow) focusedWindow.webContents.send('showAccounts');
        }
      }
    ]
  }, // Edit
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
  } // View
]; //menuTemplate

const menu = Menu.buildFromTemplate(menuTemplate)
Menu.setApplicationMenu(menu)

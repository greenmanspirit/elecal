/*
 * This script contains the code for the Electron Main process.
 */

/*
 * Imports
 */
const {BrowserWindow, app, ipcMain, Menu} = require('electron')
const ipc = ipcMain
const path = require('path')
const fs = require('fs')
const crypto = require('crypto')

let accounts = []
let password = ''

/*
 * Config file management
 */

// This ipc event passes the configPath to the Renderer process. This is here
//   because process.env.HOME does not exist in the Renderer process.
ipc.on('getConfigDir', (event, arg) => {
  event.returnValue = configPath
}) // ipc.on

// Create the config directory path. I prefer .config to having a .elecal in
//   the users home directory because home directories can become overwhelmed
//   with app dirs.
let configPath = path.join(process.env.HOME, '.config', 'elecal')
let accountConfig = path.join(configPath, 'accounts')

// Check to see if the configPath exists
fs.access(configPath, fs.constants.R_OK | fs.constants.W_OK, function (err) {
  // If there is an error, try creating the configPath
  if (err) {
    fs.mkdirSync(configPath, 0o700)
  }
}) // fs.access

// Load Accounts from encrypted config file
ipc.on('loadAccounts', function (event, passwd) {
  password = passwd
  // Test to see if the file can be written and read.
  fs.access(accountConfig, fs.constants.R_OK | fs.constants.W_OK, function (err) {
    // If there is an error, try creating the config file.
    if (err) {
      // Encrypt tmpAccounts and encode at base64
      let cipher = crypto.createCipher('aes-256-ctr', password)
      let crypted = cipher.update(JSON.stringify(accounts), 'utf8', 'base64')
      crypted += cipher.final('base64')
      // Open accountConfig with 'w' and mode 0o600 so we can create the
      //   initial config file for the user. Since this is config data, I use
      //   writeSync.
      fs.open(accountConfig, 'w', 0o600, function (err, fd) {
        if (err) {}
        fs.writeSync(fd, crypted)
        fs.close(fd)
      }) // fs.open
      event.returnValue = accounts
    } else {
      let encryptedAccounts = fs.readFileSync(accountConfig, {encoding: 'utf8'})
      let decipher = crypto.createDecipher('aes-256-ctr', password)
      accounts = decipher.update(encryptedAccounts, 'base64', 'utf8')
      accounts += decipher.final('utf8')
      try {
        accounts = JSON.parse(accounts)
        event.returnValue = accounts
      } catch (err) {
        accounts = []
        event.returnValue = false
      }
    }
  }) // fs.access
}) // ipc.on loadAccounts

// Save Accounts to encrypted config file
ipc.on('saveAccounts', function (event, accounts) {
  let cipher = crypto.createCipher('aes-256-ctr', password)
  let encryptedAccounts = cipher.update(JSON.stringify(accounts), 'utf8', 'base64')
  encryptedAccounts += cipher.final('base64')
  fs.writeFileSync(accountConfig, encryptedAccounts, {encoding: 'utf8'})
}) // ipc.on saveAccounts

ipc.on('getAccounts', function (event, arg) {
  event.returnValue = accounts
})

/*
 * Window management
 */
let appWindow
// create and load the BrowserWindow when the app is ready
app.on('ready', function () {
  let appWindow = new BrowserWindow({backgroundColor: '#fafafa'})
  appWindow.loadURL(path.join('file://', __dirname, '/index.html'))
}) // app.on 'ready'

// When all windows are closed (in this case there is just one) quit the app
app.on('window-all-closed', function () {
  app.quit()
}) // app.on 'window-all-closed'

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
        label: 'Preferences',
        click (item, focusedWindow) {
          if (focusedWindow) {
            let preferencesWindow = new BrowserWindow({
              backgroundColor: '#fafafa',
              parent: appWindow,
              fullscreenable: false,
              width: 600,
              height: 400})
            preferencesWindow.setMenuBarVisibility(false)
            preferencesWindow.loadURL(path.join('file://', __dirname, '/preferences.html'))
          }
        }
      },
      {
        label: 'Accounts',
        click (item, focusedWindow) {
          if (focusedWindow) focusedWindow.webContents.send('showAccounts')
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
          if (focusedWindow) focusedWindow.reload()
        }
      },
      {
        label: 'Toggle Developer Tools',
        accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
        click (item, focusedWindow) {
          if (focusedWindow) focusedWindow.webContents.toggleDevTools()
        }
      },
      {type: 'separator'},
      {role: 'togglefullscreen'}
    ]
  } // View
] // menuTemplate

const menu = Menu.buildFromTemplate(menuTemplate)
Menu.setApplicationMenu(menu)

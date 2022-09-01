// Main App Module
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const { default: installExtension, REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } = require('electron-devtools-installer');

const path = require('path');
const log = require("electron-log");
const { autoUpdater } = require('electron-updater');

// Backend
const { cleanUp } = require('./backend');

// Autoupdater Debug Setup
autoUpdater.logger = log
autoUpdater.logger.transports.file.level = "info"
autoUpdater.autoDownload = false;

// log.info(`[${Date()}]App Starting...`);

// mainwindow and launcher window
let mainWindow, launcher_win, updater;


// ==================== Dev tools ==============================
const installExtensions = async () => {
    const extensions = [
        REACT_DEVELOPER_TOOLS,
        REDUX_DEVTOOLS,
    ]

    return Promise
        .all(extensions.map(name => installExtension(name)))
        .catch(()=>{})//console.log)
}


// ==================== Windows and Launcher Methods ==============================
// Create main window
function createWindow() {
    mainWindow = new BrowserWindow({

        // minWidth: 1002,
        // minHeight: 585,
        // Set the path of an additional "preload" script that can be used to
        // communicate between node-land and browser-land.
        webPreferences: {
            nodeIntegration: true, // is default value after Electron v5
            contextIsolation: true, // protect against prototype pollution
            enableRemoteModule: false, // turn off remote
            nativeWindowOpen: true,
            preload: path.join(__dirname, "preload.js"), // use a preload script,
        },

        title: "Mirage School Software"
    });

    // In production, set the initial browser path to the local bundle generated
    // by the Create React App build process.
    // In development, set it to localhost to allow live/hot-reloading.

    const appUrl = app.isPackaged ?
        `file://${path.join(__dirname, '../build/index.html')}` :
        "http://localhost:3000";

    mainWindow.setBackgroundColor("#563d7c");
    mainWindow.loadURL(appUrl);
    mainWindow.hide();
    // Automatically open Chrome's DevTools in development mode.

    if (!app.isPackaged) {
        mainWindow.webContents.openDevTools();
    }

    mainWindow.maximize();

    mainWindow.once('ready-to-show', () => {
        // Delay main window from showing as the launcher is processing
        // delay is for 3.5 seconds
        // autoUpdater.checkForUpdatesAndNotify();
        setTimeout(() => {
            try {
                launcher_win.close();
            } catch {}

            launcher_win = null;
        }, 2500)

        try {

            mainWindow.show();
            launcher_win.show();
        } catch {}
    });

    mainWindow.on('close',()=>{
        console.log("Closing app....")
        if (!app.isPackaged) return
        // only runs when app is packed
        // to avaoid always login in development
        cleanUp()
    })

    // mainWindow.isDestroyed
}

// create launcher
function loadLauncher() {
    launcher_win = new BrowserWindow({
        height: 450,
        width: 550,
        webPreferences: {
            nodeIntegration: true, // is default value after Electron v5
            contextIsolation: true, // protect against prototype pollution
            enableRemoteModule: false, // turn off remote
            preload: path.join(__dirname, "preload.js")
        },
        frame: false,
        maximizable: false,
        minimizable: false,
        resizable: false,
        title: 'Launching Mirage School Software',
    });

    const appUrl = `file://${path.join(__dirname, 'Launcher','launcher.html')}`

    launcher_win.loadURL(appUrl);
    if (!app.isPackaged) {
        launcher_win.webContents.openDevTools();
    }

}


// Launch Application
async function launchApp() {

    loadLauncher(); // run Launcher

    const dev = !app.isPackaged;

    if (dev && process.argv.indexOf('--noDevServer') === -1) {
        await installExtensions()
    }


    ipcMain.handle("settings:started", () => {
        console.log("Done initializing app!")
        createWindow()
        launcher_win.show()

        return true
    })
}

// ==================== oooooooooooooooooooooooooooo ==============================



// ==================== Main Electron APP API ==============================
// This method will be called when Electron has finished its initialization and
// is ready to create the browser windows.
// Some APIs can only be used after this event occurs.

app.on('ready', async () => {

    await launchApp() // launch application

    app.on('activate', async function() {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) {
            // createWindow();
            await launchApp()
        }
    });

    // let appDir = app.getPath('userData');
    // const app_data_dir = path.join(appDir, "data")

    // protocol.registerFileProtocol('mirage', (request, callback) => {
    //     // console.log("Received URL", request.url)
    //     const url = request.url.substr(9)
    //     let cb = path.normalize(`${app_data_dir}/${url.replaceAll('--','\\')}`)

    //     callback({ path: cb })
    // });

    autoUpdater.checkForUpdates()
        .then(res => {
            console.log("Update Response => ", res);
        })
        .catch((err) => {
            // console.log(err);
            console.log("Unable to Check update");
        })
});




// Quit when all windows are closed, except on macOS.
// There, it's common for applications and their menu bar to stay active until
// the user quits  explicitly with Cmd + Q.

app.on('window-all-closed', () => {
    if (process.platform !== "darwin") {
        app.quit();
        mainWindow = null;
    }
});


// ==================== oooooooooooooooooooooooooooo ==============================


// ==================== AUTO UPDATER ==============================

autoUpdater.on('error', (error) => {
    // dialog.showErrorBox('Error: ', error == null ? "unknown" : (error.stack || error).toString())
    // silence autoupdate error
    console.log("Error Occured");
});


autoUpdater.on('update-available', () => {
    dialog.showMessageBox({
        type: 'info',
        title: 'Found New Update',
        message: 'Found new update, do you want update now?',
        buttons: ['Sure', 'No']
    }).then((buttonIndex) => {
        if (buttonIndex === 0) {
            autoUpdater.downloadUpdate()
        } else {
            updater.enabled = true
            updater = null
        }
    })
})

autoUpdater.on('update-downloaded', () => {
    dialog.showMessageBox({
        title: 'Install Updates',
        message: 'Updates downloaded, application will be quit for update...'
    }).then(() => {
        setImmediate(() => autoUpdater.quitAndInstall())
    })
})

// ==================== oooooooooooo ==============================


// ==================== MAIN COMMUNICATION API ==============================

// get app version
ipcMain.handle('app:version', (event) => {
    // event.sender.send('app:version', { version: app.getVersion() });
    return app.getVersion();
});
 

// restart application
ipcMain.on('restart_app', () => {
    mainWindow.close();

    mainWindow = null;

    createWindow();
});

// ==================== ooooooooooooooooooooo ==============================
const { app, BrowserWindow } = require('electron/main')
const path = require('path')

app.whenReady().then(() => {
    // Create Splash Screen
    const splash = new BrowserWindow({
        width: 810,
        height: 610,
        transparent: true,
        frame: false,
        alwaysOnTop: true,
        icon: path.join(__dirname, "images", "list"),
    });

    // Load splash screen HTML
    splash.loadFile(path.join(__dirname, "dist", "splash.html"));

    // Create Main Window (but keep it hidden initially)
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        show: false,
        icon: path.join(__dirname, "images", "list"),
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            experimentalFeatures: true,
            preload: path.join(__dirname, "preload.cjs"),
            // for debugging purpose only
            devTools: true,
            sandbox: false,
        },
        autoHideMenuBar: true,
    });

    // Load Main App after splash screen
    const startURL =
        process.env.ELECTRON_START_URL || `file://${path.join(__dirname, "dist", "index.html")}`;
    if (startURL.startsWith("http")) {
        mainWindow.loadURL(startURL);
    } else {
        mainWindow.loadFile(path.join(__dirname, "dist", "index.html"));
    }

    // Once the main window is ready, close the splash screen and show the main window
    mainWindow.once("ready-to-show", () => {
        splash.destroy();
        mainWindow.maximize();
        mainWindow.show();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
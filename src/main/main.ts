import { app, BrowserWindow, dialog } from 'electron';
import * as path from 'path';
import started from 'electron-squirrel-startup';
import * as fs from 'fs';
import { registerIpcHandlers } from './ipc/handlers';
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
    );
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
  return mainWindow;
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  let osuReplaysPath = path.join(
    app.getPath('home'),
    'AppData',
    'Local',
    'osu!',
    'Replays'
  );

  if (!fs.existsSync(osuReplaysPath)) {
    const result = await dialog.showOpenDialog(null, {
      properties: ['openDirectory'],
      title: 'Select your osu! Replays folder',
    });

    if (!result.canceled && result.filePaths.length > 0) {
      osuReplaysPath = result.filePaths[0];
      console.log('User selected path:', osuReplaysPath);
    } else {
      console.log('No path selected by user');
    }
  } else {
    console.log('osu! replays folder found:', osuReplaysPath);
  }

  const mainWindow = createWindow();
  registerIpcHandlers(mainWindow, osuReplaysPath);
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

import { ipcMain, BrowserWindow } from 'electron';
import { IpcChannels } from '../../shared/types';
import * as chokidar from 'chokidar';
import { agent } from '../agent/agent'

let watcher: chokidar.FSWatcher | null = null;
let isWatching = false;
let osuReplaysPath = '';

export const registerIpcHandlers = (mainWindow: BrowserWindow, path: string) => {
  osuReplaysPath = path;

  ipcMain.handle(IpcChannels.START_WATCHING, (_, osuPath: string) => {
    if (isWatching) return { success: false, message: 'Already watching' };
    
    try {
      watcher = chokidar.watch(osuPath, { ignoreInitial: true });
      watcher.on('add', (filePath) => {
        if (filePath.endsWith('.osr')) {
          mainWindow.webContents.send('new-replay', filePath);
        }
      });
      isWatching = true;
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  });

  ipcMain.handle(IpcChannels.STOP_WATCHING, () => {
    if (watcher) {
      watcher.close();
      watcher = null;
    }
    isWatching = false;
    return { success: true };
  });

  ipcMain.handle(IpcChannels.INVOKE_AGENT, async (_, message: string) => {
    const config = {
      configurable: { thread_id: "1" },
      context: { user_id: "1" },
    };

    const response = await agent.invoke({ messages: [{ role: "user", content: message }] }, config);
    return { output: response.messages[response.messages.length - 1].content };
  });

  ipcMain.handle(IpcChannels.GET_WATCH_STATUS, () => {
    return { isWatching };
  });

  ipcMain.handle(IpcChannels.GET_OSU_PATH, () => osuReplaysPath)
};
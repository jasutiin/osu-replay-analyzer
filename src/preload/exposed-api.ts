import { contextBridge, ipcRenderer } from 'electron';
import { IpcChannels } from '../shared/types';

// these are basically connecting what we have in handlers.ts to the renderer so
// we can use it via window.electronAPI.<name_of_api_here>
contextBridge.exposeInMainWorld('electronAPI', {
  startWatching: (osuPath: string) =>
    ipcRenderer.invoke(IpcChannels.START_WATCHING, osuPath),
  stopWatching: () => ipcRenderer.invoke(IpcChannels.STOP_WATCHING),
  getWatchStatus: () => ipcRenderer.invoke(IpcChannels.GET_WATCH_STATUS),
  onNewReplay: (callback: (filePath: string) => void) => {
    ipcRenderer.on('new-replay', (_, filePath) => callback(filePath));
  },
  getOsuPath: () => ipcRenderer.invoke(IpcChannels.GET_OSU_PATH),
  invokeAgent: (message: string) =>
    ipcRenderer.invoke(IpcChannels.INVOKE_AGENT, message),
  printReplayData: (osuPath: string) =>
    ipcRenderer.invoke(IpcChannels.PRINT_REPLAY_DATA, osuPath),
});

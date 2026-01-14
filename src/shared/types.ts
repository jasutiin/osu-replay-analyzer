// used between exposed-api.ts and the handlers defined in handlers.ts
export enum IpcChannels {
  START_WATCHING = 'start-watching',
  STOP_WATCHING = 'stop-watching',
  GET_WATCH_STATUS = 'get-watch-status',
  GET_OSU_PATH = 'get-osu-path',
}
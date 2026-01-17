// lzma decoder for osu! replay data
// using js-lzma pure JavaScript implementation
import * as LZMA from 'js-lzma';

export interface ReplayAction {
  time: number;
  x: number;
  y: number;
  keys: number;
}

// Create an input stream wrapper for js-lzma
function createInStream(data: Uint8Array) {
  return {
    data: data,
    offset: 0,
    readByte: function () {
      return this.data[this.offset++];
    },
  };
}

// Create an output stream wrapper for js-lzma
function createOutStream() {
  return {
    data: [] as number[],
    offset: 0,
    writeByte: function (value: number) {
      this.data[this.offset++] = value;
    },
  };
}

export function parseReplayData(
  data: Uint8Array,
  gameVersion: number,
): { replayData: ReplayAction[]; rngSeed?: number } {
  // decompress the lzma data using js-lzma
  const inStream = createInStream(data);
  const outStream = createOutStream();

  // Use decompressFile since osu! replay data has the full LZMA header (props + size)
  LZMA.decompressFile(inStream, outStream);

  const decompressed = outStream.data;

  // convert to string
  const text = new TextDecoder('utf-8').decode(new Uint8Array(decompressed));
  const actions = text.split(',');
  const replayData: ReplayAction[] = [];
  let currentTime = 0;
  let rngSeed: number | undefined;

  for (let i = 0; i < actions.length; i++) {
    const action = actions[i].trim();
    if (!action) continue; // skip empty entries
    const parts = action.split('|');
    if (parts.length === 4) {
      const w = parseInt(parts[0], 10);
      const x = parseFloat(parts[1]);
      const y = parseFloat(parts[2]);
      const z = parseInt(parts[3], 10);

      // check for rng seed frame (only for versions >= 20130319)
      if (gameVersion >= 20130319 && w === -12345 && x === 0 && y === 0) {
        rngSeed = z;
        continue; // skip adding this to replaydata
      }

      currentTime += w;
      replayData.push({ time: currentTime, x, y, keys: z });
    }
  }

  return { replayData, rngSeed };
}

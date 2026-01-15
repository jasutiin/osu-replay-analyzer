import fs from 'fs';

export interface ReplayData {
  gameMode: number;
  gameVersion: number;
  beatmapMD5: string;
  playerName: string;
  replayMD5: string;
  numberOf300s: number;
  numberOf100s: number;
  numberOf50s: number;
  numberOfGekis: number;
  numberOfKatus: number;
  numberOfMisses: number;
  totalScore: number;
  maxCombo: number;
  perfectCombo: boolean;
  mods: number;
  lifeBarGraph: string;
  timestamp: number;
  replayLength: number;
  replayData: Array<{ time: number; x: number; y: number; keys: number }>;
}

export async function parseOsrFile(
  filePath: string
): Promise<Partial<ReplayData>> {
  try {
    const buffer = fs.readFileSync(filePath.trim());
    const replay: Partial<ReplayData> = {};

    const offsetRef = { value: 0x00 };
    replay.gameMode = readByte(offsetRef, buffer);
    replay.gameVersion = readInteger(offsetRef, buffer);
    replay.beatmapMD5 = 'beatmapMD5 placeholder';
    replay.playerName = 'playerName placeholder';
    replay.replayMD5 = 'replayMD5 placeholder';

    ```
    TODO: all these values are not correct because we didn't increment the offset value
          for beatmapMD5, playerName, and replayMD5. we need to actually implement a
          readString() function
    ```;
    replay.numberOf300s = readShort(offsetRef, buffer);
    replay.numberOf100s = readShort(offsetRef, buffer);
    replay.numberOf50s = readShort(offsetRef, buffer);
    replay.numberOfGekis = readShort(offsetRef, buffer);
    replay.numberOfKatus = readShort(offsetRef, buffer);
    replay.numberOfMisses = readShort(offsetRef, buffer);
    replay.totalScore = readInteger(offsetRef, buffer);

    return replay;
  } catch (err) {
    console.log('Error type:', err.constructor.name);
    console.log('Error code:', err.code);
    console.log('Full error:', err);
  }
}

function readByte(offset: { value: number }, buffer: NonSharedBuffer): number {
  const val = buffer.readInt8(offset.value);
  offset.value++;
  return val;
}

function readShort(offset: { value: number }, buffer: NonSharedBuffer): number {
  const val = buffer.readUIntLE(offset.value, 2);
  offset.value += 2;
  return val;
}

function readInteger(
  offset: { value: number },
  buffer: NonSharedBuffer
): number {
  const val = buffer.readInt32LE(offset.value);
  offset.value += 4;
  return val;
}

// https://www.npmjs.com/package/node-osr?activeTab=code
// https://osu.ppy.sh/wiki/en/Client/File_formats/osr_%28file_format%29

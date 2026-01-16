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
  perfectCombo: number;
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
    replay.beatmapMD5 = readString(offsetRef, buffer);
    replay.playerName = readString(offsetRef, buffer);
    replay.replayMD5 = readString(offsetRef, buffer);
    replay.numberOf300s = readShort(offsetRef, buffer);
    replay.numberOf100s = readShort(offsetRef, buffer);
    replay.numberOf50s = readShort(offsetRef, buffer);
    replay.numberOfGekis = readShort(offsetRef, buffer);
    replay.numberOfKatus = readShort(offsetRef, buffer);
    replay.numberOfMisses = readShort(offsetRef, buffer);
    replay.totalScore = readInteger(offsetRef, buffer);
    replay.maxCombo = readShort(offsetRef, buffer);
    replay.perfectCombo = readByte(offsetRef, buffer);
    replay.mods = readInteger(offsetRef, buffer);
    replay.lifeBarGraph = readString(offsetRef, buffer);

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

function readString(
  offset: { value: number },
  buffer: NonSharedBuffer
): string {
  if (buffer[offset.value] === 0x00) {
    offset.value++;
    return '';
  } else if (buffer[offset.value] === 0x0b) {
    offset.value++;
    const stringLength = readULEB128(offset, buffer);
    const text = buffer.toString(
      'utf8',
      offset.value,
      offset.value + stringLength
    );
    offset.value += stringLength;
    return text;
  }

  return '';
}

// https://github.com/dlang/druntime/blob/0dfc0ce5aef1fde00713b56e9be99dcdfb04d171/src/rt/backtrace/dwarf.d#L490-L534
function readULEB128(
  offset: { value: number },
  buffer: NonSharedBuffer
): number {
  let val = 0;
  let shift = 0;
  const t = true; // eslint lmao

  while (t) {
    const byte = buffer[offset.value];
    val |= (byte & 0x7f) << shift;
    if ((byte & 0x80) == 0) {
      offset.value++;
      break;
    }
    shift += 7;
    offset.value++;
  }

  return val;
}

// https://www.npmjs.com/package/node-osr?activeTab=code
// https://osu.ppy.sh/wiki/en/Client/File_formats/osr_%28file_format%29

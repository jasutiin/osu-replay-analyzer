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

export async function parseOsrFile(filePath: string): Promise<ReplayData> {
  try {
    const smth = fs.readFileSync(filePath.trim());
    console.log(smth);
  } catch (err) {
    console.log('Error type:', err.constructor.name);
    console.log('Error code:', err.code);
    console.log('Full error:', err);
  }

  const data: ReplayData = {
    gameMode: 1,
    gameVersion: 0,
    beatmapMD5: '',
    playerName: '',
    replayMD5: '',
    numberOf300s: 0,
    numberOf100s: 0,
    numberOf50s: 0,
    numberOfGekis: 0,
    numberOfKatus: 0,
    numberOfMisses: 0,
    totalScore: 0,
    maxCombo: 0,
    perfectCombo: false,
    mods: 0,
    lifeBarGraph: '',
    timestamp: 0,
    replayLength: 0,
    replayData: [],
  };

  return data;
}

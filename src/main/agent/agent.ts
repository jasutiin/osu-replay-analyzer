import 'dotenv/config';
import { createAgent, tool, type ToolRuntime } from 'langchain';
import { parseOsrFile } from '../../utils/replay-parser/parser';
import store from '../store';

const systemPrompt = `You are an osu! assistant who helps players find flaws in their replays. You analyze their strengths and weaknesses, their cursor movement, tapping style, what could have made them miss, and so on.

You have access to two tools:

- get_replay_path: use this to get the replay path of a .osr file.
- get_replay_info: use this to get the replay info of a .osr file. it gives you the beatmap MD5 hash, the replay MD5 hash, game mode, game version, max combo, used mods, number of 50s/100s/300s, the online score id, if it was a perfect combo or not, and the total score.
- get_replay_gameplay_data: use this to get the replay gameplay data of a .osr file. it includes a replay timestamp, the x and y coordinate of the cursor at the timestamp, and the key presses at the timestamp.

You must get the replay path of a .osr file before calling get_replay_info or get_replay_gameplay_data.
`;

type AgentRuntime = ToolRuntime<unknown, { replay_path: string }>;

const getReplayPath = tool(
  () => {
    const replayPath = store.set('current-replay');
    return replayPath;
  },
  {
    name: 'get_replay_info',
    description: 'Retrieve replay path',
  },
);

const getReplayInfo = tool(
  async (_, config: AgentRuntime) => {
    const { replay_path } = config.context;
    const replayInfo = await parseOsrFile(replay_path);
    const output = {
      replay_md5_hash: replayInfo.replayMD5,
      beatmap_md5_hash: replayInfo.beatmapMD5,
      online_score_id: replayInfo.onlineScoreId,
      game_mode: replayInfo.beatmapMD5,
      game_version: replayInfo.beatmapMD5,
      number_of_300s: replayInfo.numberOf300s,
      number_of_100s: replayInfo.numberOf100s,
      number_of_50s: replayInfo.numberOf50s,
      max_combo: replayInfo.maxCombo,
      used_mods: replayInfo.mods,
      perfect_combo: replayInfo.perfectCombo,
      total_score: replayInfo.totalScore,
    };

    return JSON.stringify(output, null, 2);
  },
  {
    name: 'get_replay_info',
    description: 'Retrieve replay information',
  },
);

const getReplayGameplayData = tool(
  async (_, config: AgentRuntime) => {
    const { replay_path } = config.context;
    const replayInfo = await parseOsrFile(replay_path);

    return JSON.stringify(replayInfo.replayData, null, 2);
  },
  {
    name: 'get_replay_gameplay_data',
    description:
      'Retrieve gameplay data (timestamps, mouse coordinates, key presses)',
  },
);

export const agent = createAgent({
  model: 'claude-sonnet-4-5-20250929',
  systemPrompt: systemPrompt,
  tools: [getReplayPath, getReplayInfo, getReplayGameplayData],
});

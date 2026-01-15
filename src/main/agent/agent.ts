import * as z from 'zod';
import 'dotenv/config';
import { createAgent, tool, type ToolRuntime } from 'langchain';

const systemPrompt = `You are an osu! assistant who helps players find flaws in their replays. You analyze their strengths and weaknesses, their cursor movement, tapping style, what could have made them miss, and so on.

You have access to two tools:

- get_replay_data: use this to get the replay data of a .osr file.
- analyze_replay: use this to analyze the replay data. you must call get_replay_data first before calling this tool.
- analyze_replay_at_timestamp: use this to analyze the replay data at a certain timestamp, with your choice of how big the window is. you must call get_replay_data first before calling this tool.
- suggest_beatmaps_weaknesses: use this to recommend beatmaps to the player that address their weaknesses.
- suggest_beatmaps_strengths: use this to recommend beatmaps to the player that focus on their strengths.
- compare_with_past_replays: use this to

If a user asks you for the weather, make sure you know the location. If you can tell from the question that they mean wherever they are, use the get_user_location tool to find their location.`;

const getWeather = tool(({ city }) => `It's always sunny in ${city}!`, {
  name: 'get_weather',
  description: 'Get the weather for a given city',
  schema: z.object({
    city: z.string().describe('The city to get the weather for.'),
  }),
});

type AgentRuntime = ToolRuntime<unknown, { user_id: string }>;

const getUserLocation = tool(
  (_, config: AgentRuntime) => {
    const { user_id } = config.context;
    return user_id === '1' ? 'Florida' : 'SF';
  },
  {
    name: 'get_user_location',
    description: 'Retrieve user information based on user ID',
  }
);

const responseFormat = z.object({
  punny_response: z.string(),
  weather_conditions: z.string().optional(),
});

export const agent = createAgent({
  model: 'claude-sonnet-4-5-20250929',
  systemPrompt: systemPrompt,
  tools: [getUserLocation, getWeather],
  responseFormat,
});

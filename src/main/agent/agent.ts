import * as z from "zod";
import 'dotenv/config';
import { createAgent, tool, type ToolRuntime } from "langchain";

const systemPrompt = `You are an expert weather forecaster, who speaks in puns.

You have access to two tools:

- get_weather_for_location: use this to get the weather for a specific location
- get_user_location: use this to get the user's location

If a user asks you for the weather, make sure you know the location. If you can tell from the question that they mean wherever they are, use the get_user_location tool to find their location.`;

const getWeather = tool(
  ({ city }) => `It's always sunny in ${city}!`,
  {
    name: "get_weather",
    description: "Get the weather for a given city",
    schema: z.object({
      city: z.string().describe("The city to get the weather for."),
    }),
  },
);

type AgentRuntime = ToolRuntime<unknown, { user_id: string }>;

const getUserLocation = tool(
  (_, config: AgentRuntime) => {
    const { user_id } = config.context;
    return user_id === "1" ? "Florida" : "SF";
  },
  {
    name: "get_user_location",
    description: "Retrieve user information based on user ID",
  }
);

const responseFormat = z.object({
  punny_response: z.string(),
  weather_conditions: z.string().optional(),
});

export const agent = createAgent({
  model: "claude-sonnet-4-5-20250929",
  systemPrompt: systemPrompt,
  tools: [getUserLocation, getWeather],
  responseFormat,
});
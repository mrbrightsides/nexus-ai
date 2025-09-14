import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { DEFAULT_MODEL, SUPPORTED_MODELS } from "@/lib/constants";
import { gateway } from "@/lib/gateway";

export const maxDuration = 60;

export async function POST(req: Request) {
  const {
    messages,
    modelId = DEFAULT_MODEL,
  }: { messages: UIMessage[]; modelId: string } = await req.json();

  if (!SUPPORTED_MODELS.includes(modelId)) {
    return new Response(
      JSON.stringify({ error: `Model ${modelId} is not supported` }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const result = streamText({
    model: gateway(modelId),
    system: "You are a RANTAI Nexus AI Assistant, a multi-talented AI that makes learning Web3 fun and chill—sometimes showing up as ImamChain the digital ustadz who links blockchain with Islamic values in a light santri humor, sometimes as WisataBot the Web3 tour guide who turns dApps into travel destinations through playful storytelling, and sometimes as BlockJester the blockchain comedian who cracks complex concepts into everyday jokes—always choosing the vibe that fits your question so Web3 feels like hanging out, not studying.",
    messages: convertToModelMessages(messages),
    onError: (e) => {
      console.error("Error while streaming.", e);
    },
  });

  return result.toUIMessageStreamResponse();
}

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
    system: "AI Edukasi is a RANTAI Nexus AI Assistant, one of the planets in Planets AI — a multi-talented academic companion that makes learning across all disciplines feel fun, thoughtful, and human; sometimes showing up as ImamChain, the digital ustadz who connects deep philosophy and Islamic ethics with modern tech in light santri humor, sometimes as WisataBot, the curious guide who turns knowledge itself into an adventure through playful storytelling, and sometimes as BlockJester, the witty scholar who cracks complex theories into relatable everyday jokes — always adapting its tone and wisdom to your level, so studying feels less like memorizing and more like exploring a living universe of ideas. You were designed to guide learners and researchers through the vast galaxy of knowledge by simplifying complex scientific and technological concepts, assisting in research writing and critical thinking, and inspiring curiosity with a calm, insightful, and empathetic tone that turns learning into a meaningful journey of discovery.",
    messages: convertToModelMessages(messages),
    onError: (e) => {
      console.error("Error while streaming.", e);
    },
  });

  return result.toUIMessageStreamResponse();
}

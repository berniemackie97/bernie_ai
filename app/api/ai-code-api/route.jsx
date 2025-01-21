import { GenerateAiCode } from "@/configs/AiModel";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { prompt } = await req.json();
  try {
    const result = await GenerateAiCode.sendMessage(prompt);
    let responseText = result.response.text();

    // Remove ```json from the beginning and ``` from the end of the response text
    if (responseText.startsWith("```json")) {
      responseText = responseText.substring(7); // Remove the first 7 characters
    }
    if (!responseText.endsWith("}")) {
      responseText = responseText.substring(0, responseText.length - 4); // Remove the last 4 characters
    }

    return NextResponse.json(JSON.parse(responseText));
  } catch (e) {
    console.error("Error generating AI code:", e);
    if (e.response) {
      console.error("Response data:", e.response.data);
      console.error("Response status:", e.response.status);
      console.error("Response headers:", e.response.headers);
    } else if (e.request) {
      console.error("Request data:", e.request);
    } else {
      console.error("Error message:", e.message);
    }
    return NextResponse.json({ error: e.message, stack: e.stack });
  }
}

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
      responseText = responseText.substring(0, responseText.length - 4); // Remove the last 3 characters
    }

    return NextResponse.json(JSON.parse(responseText));
  } catch (e) {
    console.error("Error generating AI code:", error);
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
      console.error("Response headers:", error.response.headers);
    } else if (error.request) {
      console.error("Request data:", error.request);
    } else {
      console.error("Error message:", error.message);
    }
    return NextResponse.json({ error: e.message, stack: e.stack });
  }
}

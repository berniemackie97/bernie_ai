import { GenerateAiCode } from "@/configs/AiModel";
import { NextResponse } from "next/server";

export async function POST(req) {
    const {prompt} = await req.json();
    try {
        const result = await GenerateAiCode.sendMessage(prompt);
        const response = result.response.text();
        return NextResponse.json(response);
    } catch (e) {
        console.error(e);
        return NextResponse.json({error: response});
    }
}
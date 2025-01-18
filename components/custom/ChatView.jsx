"use client";
import { UserDetailContext } from "@/context/UserDetailContext";
import { api } from "@/convex/_generated/api";
import Colors from "@/data/Colors";
import { useConvex, useMutation } from "convex/react";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import { MessagesContext } from "@/context/MessagesContext"; // Added import for MessagesContext
import Lookup from "@/data/Lookup";
import { ArrowRight, Link, Loader2Icon } from "lucide-react";
import axios from "axios";
import Prompt from "@/data/Prompt";
import ReactMarkdown from "react-markdown";

function ChatView() {
  const { id } = useParams();
  const convex = useConvex();
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const { messages, setMessages } = useContext(MessagesContext);
  const [userInput, setUserInput] = useState();
  const [loading, setLoading] = useState(false);
  const UpdateMessages = useMutation(api.workspace.UpdateMessages);

  useEffect(() => {
    if (id) {
      GetWorkspaceData();
    }
  }, [id]);

  /**
   * Used to get workspace data using the workspaceID
   */
  const GetWorkspaceData = async () => {
    const result = await convex.query(api.workspace.GetWorkspace, {
      workspaceID: id,
    });
    setMessages(result?.messages);
    console.log(result);
  };

  useEffect(() => {
    if (messages?.length > 0) {
      const role = messages[messages.length - 1].role;
      if (role === "user") {
        // commeted out for testing do not want to make so many calls
        GetAiResponse();
      }
    }
  }, [messages]);

  const GetAiResponse = async () => {
    setLoading(true);
    const PROMPT = JSON.stringify(messages) + Prompt.CHAT_PROMPT;
    const result = await axios.post("/api/ai-api", {
      prompt: PROMPT,
    });
    // console.log(result.data.result);
    const aiResponse = { role: "ai", content: result.data.result };
    setMessages((prev) => [...prev, aiResponse]);
    await UpdateMessages({
      workspaceID: id,
      messages: [...messages, aiResponse],
    });
    setLoading(false);
  };

  const onGenerate = async (input) => {
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: input,
      },
    ]);
    setUserInput("");
  };

  return (
    <div className="relative h-[85vh] flex flex-col">
      <div className="flex-1 overflow-y-scroll scrollbar-hide">
        {Array.isArray(messages) &&
          messages?.map((message, index) => (
            <div
              key={index}
              style={{
                backgroundColor: Colors.CHAT_BACKGROUND,
              }}
              className="p-3 rounded-lg mb-2 flex gap-2 items-center leading-7"
            >
              {message?.role === "user" && (
                <Image
                  src={userDetail?.picture}
                  alt="user"
                  width={35}
                  height={35}
                  className="rounded-full"
                />
              )}
              <ReactMarkdown className="flex flex-col">{message.content}</ReactMarkdown>
            </div>
          ))}

        {loading && (
          <div
            className="p-3 rounded-lg mb-2 flex gap-2 items-center"
            style={{ backgroundColor: Colors.CHAT_BACKGROUND }}
          >
            <Loader2Icon className="animate-spin" />
            <h2>Thinking...</h2>
          </div>
        )}
      </div>
      {/* Input Section */}
      <div
        className="p-5 border rounded-xl max-w-xl w-full mt-3"
        style={{
          backgroundColor: Colors.BACKGROUND,
        }}
      >
        <div className="flex gap-2">
          <textarea
            value={userInput}
            placeholder={Lookup.INPUT_PLACEHOLDER}
            className="outline-none bg-transparent w-full h-32 max-h-56 resize-none"
            onChange={(event) => setUserInput(event.target.value)}
          />
          {userInput && (
            <ArrowRight
              onClick={() => onGenerate(userInput)}
              className="bg-blue-500 p-2 h-10 w-10 rounded-md cursor-pointer"
            />
          )}
        </div>
        <div>
          <Link className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

export default ChatView;

"use client";
import { UserDetailContext } from "@/context/UserDetailContext";
import { api } from "@/convex/_generated/api";
import Colors from "@/data/Colors";
import { useConvex, useMutation } from "convex/react";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useContext, useEffect, useState, useRef } from "react";
import { MessagesContext } from "@/context/MessagesContext"; // Added import for MessagesContext
import Lookup from "@/data/Lookup";
import { ArrowRight, Link, Loader2Icon } from "lucide-react";
import axios from "axios";
import Prompt from "@/data/Prompt";
import ReactMarkdown from "react-markdown";
import { LoadingContext } from "@/context/LoadingContext";

function ChatView() {
  const { id } = useParams();
  const convex = useConvex();
  const { userDetail } = useContext(UserDetailContext);
  const { messages, setMessages } = useContext(MessagesContext);
  const {codeViewLoading} = useContext(LoadingContext)
  const [userInput, setUserInput] = useState();
  const [loading, setLoading] = useState(false);
  const UpdateMessages = useMutation(api.workspace.UpdateMessages);
  const chatAreaRef = useRef(null);

  // Scroll to the bottom of the chat area whenever messages change
  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // Fetch workspace data when the workspace ID changes
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
  };

  // Trigger AI response when a new user message is added
  useEffect(() => {
    if (messages?.length > 0) {
      const role = messages[messages.length - 1].role;
      if (role === "user") {
        // commeted out for testing do not want to make so many calls
        GetAiResponse();
      }
    }
  }, [messages]);

  /**
   * Fetches AI response based on the current messages
   */
  const GetAiResponse = async () => {
    setLoading(true);
    const PROMPT = JSON.stringify(messages) + Prompt.CHAT_PROMPT;
    const result = await axios.post("/api/ai-api", {
      prompt: PROMPT,
    });
    const aiResponse = { role: "ai", content: result.data.result };
    setMessages((prev) => [...prev, aiResponse]);
    await UpdateMessages({
      workspaceID: id,
      messages: [...messages, aiResponse],
    });
    setLoading(false);
  };

/**
 * Handles the generation of a new message based on user input
 * @param {string} input - The user input
 */
  const onGenerate = async (input) => {
      // Update the messages state by adding a new user message
    setMessages((prev) => [
      ...prev, // Spread the previous messages
      {
        role: "user",
        content: input,
      },
    ]);
    setUserInput("");
  };

  return (
    <div className="relative h-[85vh] flex flex-col">
      {/* Chat area */}
      <div
        ref={chatAreaRef}
        className="flex-1 overflow-y-scroll scrollbar-hide"
      >
        {/* Render messages if messages is an array */}
        {Array.isArray(messages) &&
          messages?.map((message, index) => (
            <div
              key={index}
              style={{
                backgroundColor: Colors.CHAT_BACKGROUND,
              }}
              className="p-3 rounded-lg mb-2 flex gap-2 items-center leading-7"
            >
              {/* Display user image if the message role is 'user' */}
              {message?.role === "user" && (
                <Image
                  src={userDetail?.picture}
                  alt="user"
                  width={35}
                  height={35}
                  className="rounded-full"
                />
              )}
              {/* Display message content using ReactMarkdown */}
              <ReactMarkdown className="flex flex-col">
                {message.content}
              </ReactMarkdown>
            </div>
          ))}

        {/* Show loading indicator when loading is true */}
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
          {/* Textarea for user input */}
          <textarea
            value={userInput}
            placeholder={Lookup.INPUT_PLACEHOLDER}
            className="outline-none bg-transparent w-full h-32 max-h-56 resize-none"
            onChange={(event) => setUserInput(event.target.value)}
          />
          {/* Show send button if userInput is not empty and loading is false */}
          {userInput && !loading && !codeViewLoading && (
            <ArrowRight
              onClick={() => onGenerate(userInput)}
              className="bg-blue-500 p-2 h-10 w-10 rounded-md cursor-pointer"
            />
          )}
          {/* Show loading spinner if loading is true */}
          {userInput && loading || codeViewLoading && (
            <Loader2Icon className="animate-spin bg-blue-500 p-2 h-10 w-10 rounded-md" />
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

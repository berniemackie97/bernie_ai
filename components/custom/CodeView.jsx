"use client";
import { MessagesContext } from "@/context/MessagesContext";
import Lookup from "@/data/Lookup";
import Prompt from "@/data/Prompt";
import {
  SandpackCodeEditor,
  SandpackFileExplorer,
  SandpackLayout,
  SandpackPreview,
  SandpackProvider,
} from "@codesandbox/sandpack-react";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";

function CodeView() {
  const [activeTab, setActiveTab] = useState("code");
  const [files, setFiles] = useState(Lookup?.DEFAULT_FILE);
  const { messages, setMessages } = useContext(MessagesContext);

  useEffect(() => {
    if (messages?.length > 0) {
      const role = messages[messages.length - 1].role;
      if (role === "user") {
        GenerateAiCode();
      }
    }
  }, [messages]);

  const GenerateAiCode = async () => {
    const PROMPT = JSON.stringify(messages) + " " + Prompt.CODE_GEN_PROMPT;
      try {
        const result = await axios.post("/api/ai-code-api", {
          prompt: PROMPT
        });
        console.log(result.data);
        const aiResponse = result.data;
  
        const mergedFiles = { ...Lookup.DEFAULT_FILE, ...aiResponse?.files };
        setFiles(mergedFiles);
      } catch (error) {
        console.error("Error generating AI code:", error);
      }
  };
  return (
    <div>
      <div className="bg-[#181818] w-full p-2 border">
        <div className="flex items-center flex-wrap shrink-0 bg-black p-1 justify-center rounded-full w-[140px] gap-3">
          <h2
            onClick={() => setActiveTab("code")}
            className={`text-sm cursor-pointer ${activeTab == "code" && "text-blue-500 bg-blue-500 bg-opacity-25 p-1 px-2 rounded-full"}`}
          >
            Code
          </h2>
          <h2
            onClick={() => setActiveTab("preview")}
            className={`text-sm cursor-pointer ${activeTab == "preview" && "text-blue-500 bg-blue-500 bg-opacity-25 p-1 px-2 rounded-full"}`}
          >
            Preview
          </h2>
        </div>
      </div>
      <SandpackProvider
        files={files}
        template="react"
        theme={"dark"}
        customSetup={{
          dependencies: {
            ...Lookup.DEPENDANCY,
          },
        }}
        options={{
          externalResources: ["https://cdn.tailwindcss.com"],
        }}
      >
        <SandpackLayout>
          {activeTab == "code" ? (
            <>
              <SandpackFileExplorer style={{ height: "80vh" }} />
              <SandpackCodeEditor language="jsx" style={{ height: "80vh" }} />
            </>
          ) : (
            <>
              <SandpackPreview
                style={{ height: "80vh" }}
                showNavigator={true}
              />
            </>
          )}
        </SandpackLayout>
      </SandpackProvider>
    </div>
  );
}

export default CodeView;

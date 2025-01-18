"use client";
import { UserDetailContext } from "@/context/UserDetailContext";
import { api } from "@/convex/_generated/api";
import Colors from "@/data/Colors";
import { useConvex } from "convex/react";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useContext, useEffect } from "react";
import { MessagesContext } from "@/context/MessagesContext"; // Added import for MessagesContext

function ChatView() {
  const { id } = useParams();
  const convex = useConvex();
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const { messages, setMessages } = useContext(MessagesContext); // Added useContext for MessagesContext

  useEffect(() => {
    id && GetWorkspaceData();
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

  return (
    <div>
      <div>
        {Array.isArray(messages) && messages?.map((message, index) => (
          <div
            key={index}
            style={{
              backgroundColor: Colors.CHAT_BACKGROUND,
            }}
            className="p-3 rounded-lg mb-2 flex gap-2 items-start"
          >
            {message?.role === 'user' && (
              <Image
                src={userDetail?.picture}
                alt="user"
                width={35}
                height={35}
                className="rounded-full"
              />
            )}
            <h2>{message.content}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChatView;
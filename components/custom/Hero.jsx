"use client";
import { MessagesContext } from "@/context/MessagesContext";
import { UserDetailContext } from "@/context/UserDetailContext";
import Colors from "@/data/Colors";
import Lookup from "@/data/Lookup";
import { ArrowRight, Link, Loader2Icon } from "lucide-react";
import React, { useContext, useState } from "react";
import SignInDialog from "./SignInDialog";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { LoadingContext } from "@/context/LoadingContext";

function Hero() {
  const [userInput, setUserInput] = useState("");
  const { setMessages } = useContext(MessagesContext);
  const { userDetail } = useContext(UserDetailContext);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const CreateWorkSpace = useMutation(api.workspace.CreateWorkspace);
  const router = useRouter();

  /**
   * Handles the generation of a new workspace based on user input
   * @param {string} input - The user input
   */
  const onGenerate = async (input) => {
    setLoading(true);
    // If user is not signed in, open the sign-in dialog
    if (!userDetail?.name) {
      setOpenDialog(true);
      return;
    }
    const message = {
      role: "user",
      content: input,
    };
    // Set the message in the MessagesContext
    setMessages(message);
    try {
      // Create a new workspace with the user ID and message
      const workspaceID = await CreateWorkSpace({
        user: userDetail._id,
        messages: [message],
      });
      router.push(`/workspace/${workspaceID}`);
    } catch (error) {
      console.error("Error creating workspace:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center mt-36 xl:mt-52 gap-2">
      <h2 className="font-bold text-4xl">{Lookup.HERO_HEADING}</h2>
      <p className="text-gray-400 font-medium">{Lookup.HERO_DESC}</p>

      <div
        className="p-5 border rounded-xl max-w-xl w-full mt-3"
        style={{
          backgroundColor: Colors.BACKGROUND,
        }}
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-transparent bg-opacity-80 z-10">
            <Loader2Icon className="animate-spin mt-10 w-12 h-12" />
          </div>
        )}
        <div className="flex gap-2 relative z-0">
          {/* Textarea for user input */}
          <textarea
            placeholder={Lookup.INPUT_PLACEHOLDER}
            className="outline-none bg-transparent w-full h-32 max-h-56 resize-none"
            onChange={(event) => setUserInput(event.target.value)}
          />
          {/* Show send button if userInput is not empty */}
          {userInput && !loading && (
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

      <div className="flex flex-wrap max-w-2xl items-center justify-center gap-3 mt-8">
        {Lookup?.SUGGSTIONS.map((suggestion, index) => (
          <h2
            key={index}
            onClick={() => onGenerate(suggestion)}
            className="p-1 px-2 border rounded-full text-sm text-gray-400 hover:text-white cursor-pointer"
          >
            {suggestion}
          </h2>
        ))}
      </div>
      {/* Sign-in dialog */}
      {openDialog && <SignInDialog onClose={() => setOpenDialog(false)} />}
    </div>
  );
}

export default Hero;

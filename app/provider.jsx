"use client";
import React, { useState, useEffect } from "react";
import Header from "@/components/custom/Header";
import { MessagesContext } from "@/context/MessagesContext";
import { UserDetailContext } from "@/context/UserDetailContext";
import { LoadingContextProvider } from "@/context/LoadingContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useConvex } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ThemeProvider as NextThemesProvider } from "next-themes";

function Provider({ children }) {
  const [messages, setMessages] = useState();
  const [userDetail, setUserDetail] = useState();
  const convex = useConvex();

  useEffect(() => {
    IsAuthenticated();
  }, []);

  const IsAuthenticated = async () => {
    if (typeof window !== "undefined") {
      const user = JSON.parse(localStorage.getItem("userDetail"));
      if (user && user.email) {
        try {
          const result = await convex.query(api.users.GetUser, {
            email: user.email,
          });
          setUserDetail(result);
          console.log(result);
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      } else {
        console.warn("User details not found in localStorage");
      }
    }
  };

  return (
    <div>
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
        <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
          <MessagesContext.Provider value={{ messages, setMessages }}>
            <LoadingContextProvider>
              <NextThemesProvider
                attribute="class"
                defaultTheme="dark"
                enableSystem
                disableTransitionOnChange
              >
                <Header />
                {children}
              </NextThemesProvider>
            </LoadingContextProvider>
          </MessagesContext.Provider>
        </UserDetailContext.Provider>
      </GoogleOAuthProvider>
    </div>
  );
}

export default Provider;

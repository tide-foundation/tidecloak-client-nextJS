"use client"

// Equivalent to Page Router's index.js file.
// Home page

import React, { useEffect } from "react";
import IAMService from "/lib/IAMService";
import { useAppContext } from "./context/context";
import { useRouter } from "next/navigation";

export default function HomePage() {

  const {authenticated, contextLoading} = useAppContext();
  const router = useRouter();

  // Check in background if user already authenticated
  useEffect(() => {
    if (!contextLoading){
      if (authenticated) {
        // If already authenticated, skip screen
        router.push("/auth/redirect");
      }
    }
    
  }, [authenticated]);

  const handleLogin = () => {
    // Display and handle a login button
    IAMService.doLogin();
  };

  return (
    !contextLoading
    ?
    <div>
      <h1>Welcome to My App</h1>
      <p>This is a public page. Please log in to access protected content.</p>
      <button onClick={handleLogin}>Login</button>
    </div>
    :
    <div>
      <>Waiting for context to load...</>
    </div>
  );
}

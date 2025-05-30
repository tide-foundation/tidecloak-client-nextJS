"use client"

// Equivalent to Page Router's index.js file.
// Home page

import React, { useEffect } from "react";
import IAMService from "/lib/IAMService";
import { useAppContext } from "./context/context";

export default function HomePage() {

  const {authenticated} = useAppContext();

  // Check in background if user already authenticated
  useEffect(() => {
    if (authenticated) {
      // If already authenticated, skip screen
      window.location.href = "/auth/redirect";
    }
   
  }, []);

  const handleLogin = () => {
    // Display and handle a login button
    IAMService.doLogin();
  };

  return (
    <div>
      <h1>Welcome to My App</h1>
      <p>This is a public page. Please log in to access protected content.</p>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

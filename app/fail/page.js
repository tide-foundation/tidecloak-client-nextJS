"use client"

import React, { useEffect } from "react";
import IAMService from "/lib/IAMService";
import { useAppContext } from "../context/context";

// If user authenticated but without proper credentials, present this page
export default function FailedPage() {
  const {authenticated} = useAppContext();
  
  const handleLogout = () => {
    // Allow user to log out and start over
    IAMService.doLogout();
  };

  return (
    <div>
      <h1>Validation failed</h1>
      <p>User not allowed. Log in with a priviledged user.</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

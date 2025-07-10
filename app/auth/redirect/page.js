"use client"

import React, { useEffect } from "react";
import IAMService from "/lib/IAMService";
import { useAppContext } from "../../context/context";

export default function RedirectPage() {
  const {authenticated} = useAppContext();
  // This is the authentication callback page that securely fetch the JWT access token and redirects (stateless) session to the protected page
  useEffect(() => {
   
      window.location.href = "/protected";
  }, []);

  return;
}



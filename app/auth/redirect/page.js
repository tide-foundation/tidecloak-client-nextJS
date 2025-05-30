"use client"

import React, { useEffect } from "react";
import IAMService from "/lib/IAMService";
import { useAppContext } from "../../context/context";
import { useRouter } from "next/navigation";

export default function RedirectPage() {

  const {authenticated, contextLoading} = useAppContext();
  const router = useRouter();

  // This is the authentication callback page that securely fetch the JWT access token and redirects (stateless) session to the protected page
  useEffect(() => {
    if (!contextLoading){
      if (authenticated){
        router.push("/protected");
      }
      else {
        router.push("/");
      }
    }
  }, [contextLoading]);

  return (
    <p>Waiting for context to load...</p>
  );
}



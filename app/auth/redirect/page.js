"use client"

import React, { useEffect } from "react";
import { useTideCloak } from "@tidecloak/nextjs";
import { useRouter } from "next/navigation";

export default function RedirectPage() {

  const {authenticated, loading} = useTideCloak();
  const router = useRouter();

  // This is the authentication callback page that securely fetch the JWT access token and redirects (stateless) session to the protected page
  useEffect(() => {
    if (!loading){
      if (authenticated){
        router.push("/protected");
      }
      else {
        router.push("/");
      }
    }
  }, [loading]);

  return (
    <p>Waiting for context to load...</p>
  );
}



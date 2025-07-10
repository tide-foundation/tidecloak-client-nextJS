"use client"

// This is example for a secure (authenticated user only) page.
// In this example, an authenticated user will be presented some sensitive data 
// and will be allowed to query the server for sensitive information.

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTideCloak } from "@tidecloak/nextjs";

export default function ProtectedPage() {
  const { token, logout, tokenExp, getValueFromIdToken, hasRealmRole} = useTideCloak();
  const [username, setUsername] = useState("unknown");
  const [hasUMARole, setHasUMARole] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const {authenticated} = useTideCloak();
 
  useEffect(() => {
    // Re-init Keycloak in the browser (to read token, handle logout, etc.)
    setLoading(true);
   
      if (authenticated) {
	      // An example on collecting user information to peform client side operations (i.e. display)
        setUsername(getValueFromIdToken("preferred_username")|| "unknown-user");
        setHasUMARole(hasRealmRole( 'uma_authorization' ));
        setLoading(false);
      }
 
  }, [authenticated]);

  const handleLogout = () => {
    // Allow and handle user log out
    logout();
  };

  const fetchEndpoint = async () => {
    // An example for securely fetching information from resource server
    try {
      console.debug('[fetchEndpoint] Token valid for ' + tokenExp + ' seconds');
      const response = await fetch('/api/endpoint', {
        method: 'POST',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${token}`, // Add the token to the Authorization header
        },
      });

      if (!response.ok) {
        throw `API call failed: ${response.statusText}`;
      }

      const data = await response.json();
      setApiResponse(data); // Set the response to state
    } catch (error) {
      console.error('Error during API call:', error);
      setApiResponse({ error: error.message });
    }
  };

  return (
    <div>
      <h1>Protected Page</h1>
      {!loading ? <>
        <p>If you're seeing this, your access priviledges were successfully verified!</p>
          <p>
            <strong>Username:</strong> {username}
          </p>
          <p>
            <strong>Has UMA Role:</strong> {hasUMARole ? "Yes" : "No"}
          </p>
          <button onClick={fetchEndpoint}>Make API Call</button>
          {apiResponse && (
            <div>
              <h3>API Response:</h3>
              <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
            </div>
          )}
          <p><Link href="/protected/dob">Personal data</Link></p>
        <p/>
      </>
      :
      <>
        <p>Loading...</p>
      </>}
	  <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

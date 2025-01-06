// This is example for a secure (authenticated user only) page.
// In this example, an authenticated user will be presented some sensitive data 
// and will be allowed to query the server for sensitive information.

import React, { useEffect, useState } from "react";
import IAMService from "/lib/IAMService";

export default function ProtectedPage() {
  const [username, setUsername] = useState("unknown");
  const [hasUMARole, setHasUMARole] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);

  useEffect(() => {
    // Re-init Keycloak in the browser (to read token, handle logout, etc.)
    IAMService.initIAM(() => {
      if (IAMService.isLoggedIn()) {
	// An example on collecting user information to peform client side operations (i.e. display)
        setUsername(IAMService.getName() || "unknown-user");
        setHasUMARole(IAMService.hasOneRole( 'uma_authorization' ));
      }
    });
  }, []);

  const handleLogout = () => {
    // Allow and handle user log out
    IAMService.doLogout();
  };

  const fetchEndpoint = async () => {
    // An example for securely fetching information from resource server
    try {
      const newToken = await IAMService.getToken();
      console.debug('[fetchEndpoint] Token valid for ' + IAMService.getTokenExp() + ' seconds');
      const response = await fetch('/api/endpoint', {
        method: 'POST',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${newToken}`, // Add the token to the Authorization header
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
	  <p/>
	  <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

// This is example for a secure (authenticated user only) page.
// In this example, an authenticated user will be presented some sensitive data 
// and will be allowed to query the server for sensitive information.

import React, { useEffect, useState } from "react";
import IAMService from "/lib/IAMService";
import Link from "next/link";
import { Buffer } from "buffer";

function toHexString(byteArray) {
    return Array.from(byteArray, function(byte) {
      return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('')
  }

export default function EncryptPage() {
  const [username, setUsername] = useState("unknown");
  const [hasEncrypted, setHasEncrypted] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);
  const [dob, setDob] = useState('01/01/1970');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Re-init Keycloak in the browser (to read token, handle logout, etc.)
    IAMService.initIAM(() => {
      if (IAMService.isLoggedIn()) {
    // An example on collecting user information to peform client side operations (i.e. display)
        setUsername(IAMService.getName() || "unknown-user");
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
  

  const encrypt = async (e) => {
    setLoading(true);
    const encryptedDob = await IAMService.doEncrypt([
        {
            "data": dob,
            "tags": ["dob"]
        }
    ])

    const response = await fetch('/api/store', {
        method: 'POST',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${await IAMService.getToken()}`, // Add the token to the Authorization header
        },
        body: Buffer.from(encryptedDob[0]).toString('hex')
    });
    await response;
    console.log("Encryption successful");
    setLoading(false);
  }

  return (
    <div>
      <h1>Encrypt Page</h1>
      <p>Enter your Date of Birth to securely encrypt it with Tide</p>
      <p>
        <strong>Username:</strong> {username}
      </p>{loading ? <>
        <p>Please wait. Loading...</p>
        </> : 
        <>
        {!hasEncrypted ? <>
            <label>
            Your date of birth:
            <input
                value={dob} // ...force the input's value to match the state variable...
                onChange={e => setDob(e.target.value)} // ... and update the state variable on any edits!
            />
            </label>
            <button onClick={encrypt}>Encrypt</button>
            </> : 
            // fetch encrypted dob from server

            <>

        </>}
      </>}
      
      <p/>
      <button onClick={handleLogout}>Logout</button>
      <li>
      <Link href="/protected">Go back to protected home page</Link>
    </li>
    </div>
  );
}

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

export default function DobPage() {
  const [username, setUsername] = useState("unknown");
  const [hasEncrypted, setHasEncrypted] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);
  const [dob, setDob] = useState('unavailable');
  const [loading, setLoading] = useState(false);
  const [encryptedDataSet, setEncryptedDataSet] = useState(false);

  useEffect(() => {
    // Re-init Keycloak in the browser (to read token, handle logout, etc.)
    IAMService.initIAM(() => {
      if (IAMService.isLoggedIn()) {
    // An example on collecting user information to peform client side operations (i.e. display)
        setUsername(IAMService.getName() || "unknown-user");
      }
    });

    // Fetch dob from DB if its there
    fetchEncryptedDob();
  }, []);

  const handleLogout = () => {
    // Allow and handle user log out
    IAMService.doLogout();
  };
  const fetchEncryptedDob = async () => {
    setLoading(true);
    const resp = await fetch('/api/retrieve', {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${await IAMService.getToken()}`, // Add the token to the Authorization header
        }
      });
    const dob = JSON.parse(await resp.text()).dob;
    if(!dob) setDob("01/01/1970")
    else{
      // decrypt
      const decryptedDob = await IAMService.doDecrypt([
        {
          "encrypted": dob,
          "tags": ["dob"]
        }
      ]);
      setDob(decryptedDob);
    }
    setLoading(false);
  }

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
        body: encryptedDob[0]
    });
    const resp = await response.text();
    console.log(resp);
    setLoading(false);
  }

  return (
    <div>
      <h1>Encrypt Page</h1>
      <p>Enter your Date of Birth to securely encrypt it with Tide</p>
      <p>
      </p>{loading ? <>
        <p>Please wait. Loading...</p>
        </> : 
        <>
        <label>
            Your date of birth:
            <input
                value={dob} // ...force the input's value to match the state variable...
                onChange={e => setDob(e.target.value)} // ... and update the state variable on any edits!
            />
            </label>
            <button onClick={encrypt}>Encrypt</button>
      </>}
      
      <p/>
      <button onClick={handleLogout}>Logout</button>
      <li>
      <Link href="/protected">Go back to protected home page</Link>
    </li>
    </div>
  );
}

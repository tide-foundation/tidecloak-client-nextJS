"use client"

// This is example for a secure (authenticated user only) page.
// In this example, an authenticated user will be presented some sensitive data 
// and will be allowed to query the server for sensitive information.

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTideCloak } from "@tidecloak/nextjs";
 
//function toHexString(byteArray) {
//    return Array.from(byteArray, function(byte) {
//      return ('0' + (byte & 0xFF).toString(16)).slice(-2);
//    }).join('')
//  }

export default function DobPage() {
  const { getValueFromIdToken, token, logout, doDecrypt, doEncrypt} = useTideCloak();
  const [username, setUsername] = useState("unknown");
  const [hasEncrypted, setHasEncrypted] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);
  const [dob, setDob] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [encDoBField, setEncDoBField] = useState('undefined');

  const {authenticated} = useTideCloak();

  useEffect(() => {
    setLoading(true);
    // Re-init Keycloak in the browser (to read token, handle logout, etc.)
 
      if (authenticated) {
        // An example on collecting user information to peform client side operations (i.e. display)
        setUsername(getValueFromIdToken("preferred_username") || "unknown-user");
        // Fetch dob from DB if its there
        fetchEncryptedDob();
        setLoading(false);
      }
  
  }, [authenticated]);

  const handleLogout = () => {
    // Allow and handle user log out
    logout();
  };

  const fetchEncryptedDob = async () => {
    setLoading(true);
    const resp = await fetch('/api/retrieve', {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${token}`, // Add the token to the Authorization header
        }
      });

    const dob = JSON.parse(await resp.text()).dob;
    if(!dob) setDob("01/01/1970")
    else{
      setEncDoBField(dob);
      
      // decrypt - returned in an array
      const decryptedDob = await doDecrypt([
        {
          "encrypted": dob,
          "tags": ["dob"]
        }
      ]);

      if (dob[0]) {
        setDob(decryptedDob[0]);
      } else {
        setDob(decryptedDob);
      }
    }
    setLoading(false);
  }

  const encrypt = async (e) => {
    setLoading(true);    
    const encryptedDob = await doEncrypt([
        {
            "data": dob,
            "tags": ["dob"]
        }
    ])
    
    const response = await fetch('/api/store', {
        method: 'POST',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${token}`, // Add the token to the Authorization header
        },
        body: encryptedDob[0]
    });

    const resp = await response.text();

    setEncDoBField(encryptedDob);
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
                value={dob ?? "unavailable"} // ...force the input's value to match the state variable...
                onChange={e => setDob(e.target.value)} // ... and update the state variable on any edits!
            />
            </label>
            <button onClick={encrypt}>Encrypt</button>
			<p><strong>Encrypted DoB:</strong></p><textarea readOnly={true} value={encDoBField ?? "unavailable"} rows="1" cols="25" />
      </>}
      <p/>
      <Link href="/protected">Go back to protected home page</Link>
      <p>
      <button onClick={handleLogout}>Logout</button>
    </p>
    </div>
  );
}

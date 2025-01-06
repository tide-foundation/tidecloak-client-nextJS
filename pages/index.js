import React, { useEffect } from "react";
import IAMService from "/lib/IAMService";

export default function HomePage() {
  // Check in background if user already authenticated
  useEffect(() => {
    IAMService.initIAM((authenticated) => {
      if (authenticated) {
		// If already authenticated, skip authentication
        window.location.href = "/auth/redirect";
      }
    });
  }, []);

  const handleLogin = () => {
	// Present and handle a login button
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

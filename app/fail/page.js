"use client"

import { useTideCloak } from "@tidecloak/nextjs";

// If user authenticated but without proper credentials, present this page
export default function FailedPage() {
  const { logout } = useTideCloak();
  const handleLogout = () => {
    // Allow user to log out and start over
    logout();
  };

  return (
    <div>
      <h1>Validation failed</h1>
      <p>User not allowed. Log in with a priviledged user.</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

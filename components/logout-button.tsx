// Temp Logout Button for Testing

"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client"; // adjust path if needed

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout error:", error.message);
      return;
    }
    router.push("/login"); // redirect user to login or homepage after logout
  };

  return (
    <button onClick={handleLogout} className="btn-logout">
      Log Out
    </button>
  );
}

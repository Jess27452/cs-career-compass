"use client";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
export function SignOutButton() { const router = useRouter(); return <button className="signout-button" onClick={async () => { const supabase = createClient(); if (supabase) await supabase.auth.signOut(); router.push("/"); router.refresh(); }}>Sign out</button>; }

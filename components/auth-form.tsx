"use client";

import Link from "next/link";
import { Code2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { authSchema } from "@/lib/validation";
import { createClient } from "@/lib/supabase/client";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const [message, setMessage] = useState("");
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<z.input<typeof authSchema>>({ resolver: zodResolver(authSchema) });

  async function social(provider: "google" | "github") {
    const supabase = createClient();
    if (!supabase) { setMessage("Connect Supabase to enable sign in."); return; }
    const { error } = await supabase.auth.signInWithOAuth({ provider, options: { redirectTo: `${location.origin}/auth/callback?next=/profile` } });
    if (error) setMessage(error.message);
  }
  async function submit(values: z.input<typeof authSchema>) {
    setMessage(""); const supabase = createClient();
    if (!supabase) { setMessage("Connect Supabase to enable sign in."); return; }
    const result = mode === "login" ? await supabase.auth.signInWithPassword(values) : await supabase.auth.signUp({ email: values.email, password: values.password, options: { emailRedirectTo: `${location.origin}/auth/callback?next=/profile` } });
    if (result.error) setMessage(result.error.message); else router.push("/profile");
  }
  return <div><div className="social-auth"><button className="btn btn-secondary" onClick={() => social("google")}><span className="google-mark">G</span> Continue with Google</button><button className="btn btn-secondary" onClick={() => social("github")}><Code2 size={18} /> Continue with GitHub</button></div><div className="auth-divider"><span>or continue with email</span></div><form className="auth-form" onSubmit={handleSubmit(submit)}><label className="field-label">Email<input className="field" type="email" autoComplete="email" {...register("email")} />{errors.email && <span className="error">{errors.email.message}</span>}</label><label className="field-label">Password<input className="field" type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} {...register("password")} />{errors.password && <span className="error">{errors.password.message}</span>}</label>{message && <p className="form-message" role="status">{message}</p>}<button className="btn btn-primary" disabled={isSubmitting}>{isSubmitting ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}</button><p>{mode === "login" ? <>New here? <Link href="/signup">Create an account</Link></> : <>Already have an account? <Link href="/login">Sign in</Link></>}</p></form></div>;
}

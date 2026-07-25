import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if(!url||!key) return null;
  const store=await cookies();
  return createServerClient(url,key,{cookies:{getAll(){return store.getAll()},setAll(items){try{items.forEach(({name,value,options})=>store.set(name,value,options))}catch{}}}});
}

export async function requireUser() {
  const supabase=await createClient();
  if(!supabase) return {supabase:null,user:null,error:"Supabase is not configured"};
  const {data:{user},error}=await supabase.auth.getUser();
  return {supabase,user,error:error?.message};
}

export async function requireAdmin() {
  const state=await requireUser();
  if(!state.user||!state.supabase) return {...state,isAdmin:false};
  const {data}=await state.supabase.from("profiles").select("role").eq("id",state.user.id).single();
  return {...state,isAdmin:data?.role==="admin"};
}

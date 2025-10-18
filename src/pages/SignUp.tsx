import { FormEvent, useState } from "react";
import { signUpEmail } from "@/firebase";
import { Link, useNavigate } from "react-router-dom";


export default function SignUp(){
const nav=useNavigate();
const [name,setName]=useState("");
const [email,setEmail]=useState("");
const [password,setPassword]=useState("");
const [err,setErr]=useState<string|undefined>();


async function handle(e:FormEvent){
e.preventDefault(); setErr(undefined);
try{ await signUpEmail(email,password,name); nav("/"); }catch(e:any){ setErr(e.message||"Error"); }
}


return (
<section className="mx-auto max-w-md px-4 py-10">
<h2 className="text-3xl font-extrabold">Create Account</h2>
<form onSubmit={handle} className="mt-6 space-y-4">
<input className="w-full border rounded-xl px-4 py-3" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
<input className="w-full border rounded-xl px-4 py-3" placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
<input className="w-full border rounded-xl px-4 py-3" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
{err && <p className="text-sm text-red-600">{err}</p>}
<button className="w-full bg-black text-white rounded-xl px-4 py-3">Sign Up</button>
</form>
<p className="mt-3 text-sm">Already have an account? <Link to="/auth/sign-in" className="underline">Sign in</Link></p>
</section>
);
}
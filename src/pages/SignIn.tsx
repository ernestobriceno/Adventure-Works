import { FormEvent, useState } from "react";
import { signInWithGoogle, signInEmail } from "@/firebase";
import { Link, useNavigate } from "react-router-dom";




export default function SignIn(){
const nav=useNavigate();
const [email,setEmail]=useState("");
const [password,setPassword]=useState("");
const [err,setErr]=useState<string|undefined>();
const [loading,setLoading]=useState(false);


async function handleEmail(e:FormEvent){
e.preventDefault(); setLoading(true); setErr(undefined);
try{ await signInEmail(email,password); nav("/"); }catch(e:any){ setErr(e.message||"Error"); } finally{ setLoading(false); }
}


async function handleGoogle(){
setLoading(true); setErr(undefined);
try{ await signInWithGoogle(); nav("/"); }catch(e:any){ setErr(e.message||"Error"); } finally{ setLoading(false); }
}


return (
<section className="mx-auto max-w-7xl px-4 py-10 grid md:grid-cols-2 gap-10 items-center">
<div className="rounded-2xl overflow-hidden bg-neutral-50">
<img src="/public/bicinegra.jpg" className="w-full h-[520px] object-cover"/>
</div>
<div>
<h1 className="text-4xl font-black">AdventureWorksCycle</h1>
<h2 className="text-xl font-semibold mt-6">Sign In To AdventureWorksCycle</h2>


<div className="flex gap-4 mt-6">
<button onClick={handleGoogle} className="flex-1 border rounded-xl px-4 py-3">🇬 Sign up with Google</button>
<Link to="/auth/sign-up" className="flex-1 border rounded-xl px-4 py-3 grid place-items-center">📧 Sign up with Email</Link>
</div>


<div className="flex items-center gap-3 my-8 text-neutral-400"><span className="flex-1 border-t"></span><span>OR</span><span className="flex-1 border-t"></span></div>


<form onSubmit={handleEmail} className="space-y-4">
<div>
<label className="text-sm">Email</label>
<input type="email" className="mt-1 w-full border rounded-xl px-4 py-3" value={email} onChange={e=>setEmail(e.target.value)} required />
</div>
<div>
<label className="text-sm">Password</label>
<input type="password" className="mt-1 w-full border rounded-xl px-4 py-3" value={password} onChange={e=>setPassword(e.target.value)} required />
</div>
{err && <p className="text-sm text-red-600">{err}</p>}
<button disabled={loading} className="w-full bg-black text-white rounded-xl px-4 py-3">{loading?"Loading...":"Sign In"}</button>
</form>


<div className="mt-3 flex items-center justify-between">
<Link to="/auth/sign-up" className="text-sm text-neutral-600 underline">Register Now</Link>
<Link to="/auth/forgot" className="text-sm text-neutral-600 underline">Forget Password?</Link>
</div>
</div>
</section>
);
}
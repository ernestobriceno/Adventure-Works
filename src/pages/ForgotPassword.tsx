import { FormEvent, useState } from "react";


export default function ForgotPassword(){
const [email,setEmail]=useState("");
const [done,setDone]=useState(false);
const [err,setErr]=useState<string|undefined>();
async function handle(e:FormEvent){ 
  e.preventDefault(); 
  setErr(undefined); 
  // Password reset functionality not yet implemented in API
  setErr("Password reset functionality is not yet available. Please contact support."); 
}
return (
<section className="mx-auto max-w-md px-4 py-10">
<h2 className="text-3xl font-extrabold">Reset Password</h2>
{done? <p>We sent you an email if the account exists.</p> : (
<form onSubmit={handle} className="mt-6 space-y-4">
<input type="email" required className="w-full border rounded-xl px-4 py-3" placeholder="Your email" value={email} onChange={e=>setEmail(e.target.value)} />
{err && <p className="text-sm text-red-600">{err}</p>}
<button className="w-full bg-black text-white rounded-xl px-4 py-3">Send reset link</button>
</form>
)}
</section>
);
}
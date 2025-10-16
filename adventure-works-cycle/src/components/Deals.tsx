import { useEffect, useMemo, useRef, useState } from "react";
import { products } from "@/data/products";
import ProductCard from "./ProductCard";


function useCountdown(target: number){
const [now,setNow]=useState(Date.now());
useEffect(()=>{ const id=setInterval(()=>setNow(Date.now()),1000); return ()=>clearInterval(id); },[]);
const diff=Math.max(0,target-now); const d=Math.floor(diff/86400000), h=Math.floor((diff/3600000)%24), m=Math.floor((diff/60000)%60), s=Math.floor((diff/1000)%60);
return {d,h,m,s};
}


export default function Deals(){
const target=useMemo(()=>Date.now()+1000*60*60*24*2+1000*60*5,[]);
const {d,h,m,s}=useCountdown(target);
const ref=useRef<HTMLDivElement|null>(null);
const [idx,setIdx]=useState(0);


useEffect(()=>{ const el=ref.current; if(!el) return; el.scrollTo({ left: idx*300, behavior:"smooth"}); },[idx]);


return (
<section id="deals" className="bg-white py-12">
<div className="mx-auto max-w-7xl px-4 grid md:grid-cols-[320px_1fr] gap-6 items-start">
<div>
<a href="#" className="inline-block bg-black text-white rounded-xl px-5 py-3 shadow">Buy Now</a>
<h3 className="text-2xl font-bold mt-6">Hurry, Before It’s Too Late!</h3>
<div className="flex gap-3 mt-4">
{[{l:"Days",v:d},{l:"Hr",v:h},{l:"Mins",v:m},{l:"Sec",v:s}].map(x=> (
<div key={x.l} className="w-16 h-20 bg-white rounded-xl border shadow grid place-items-center">
<div className="text-3xl tabular-nums">{x.v.toString().padStart(2,"0")}</div>
<div className="text-xs text-neutral-500">{x.l}</div>
</div>
))}
</div>
</div>


<div className="relative">
<div ref={ref} className="flex gap-5 overflow-x-hidden">
{products.map(p=> (
<div key={p.id} className="min-w-[300px]">
<ProductCard p={p} />
</div>
))}
</div>
<div className="flex items-center gap-2 absolute -bottom-10 left-1/2 -translate-x-1/2">
{products.map((_,i)=> (
<button key={i} onClick={()=>setIdx(i)} className={`size-2 rounded-full ${i===idx?"bg-neutral-900":"bg-neutral-300"}`}></button>
))}
</div>
</div>
</div>
</section>
);
}
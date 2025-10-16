import { useMemo, useState } from "react";
import { products } from "@/data/products";
import ProductCard from "./ProductCard";


const CATS = ["Mountain (MTB)", "Hybrid", "BMX", "Electric (E-Bikes)", "Folding"] as const;


export default function NewArrivals(){
const [active,setActive]=useState<typeof CATS[number]>("Hybrid");
const filtered=useMemo(()=>products, [active]); // demo: mismos productos
return (
<section className="mx-auto max-w-7xl px-4 py-12">
<h2 className="text-3xl font-extrabold text-center">New Arrivals</h2>
<p className="text-center text-neutral-500 mt-2 max-w-2xl mx-auto">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Scelerisque duis ultrices sollicitudin aliquam sem.</p>


<div className="flex flex-wrap gap-3 justify-center mt-6">
{CATS.map(c=> (
<button key={c} onClick={()=>setActive(c)} className={`px-4 py-2 rounded-xl text-sm border ${active===c?"bg-black text-white shadow":"bg-white"}`}>{c}</button>
))}
</div>


<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
{filtered.map(p=> (<ProductCard key={p.id} p={p}/>))}
</div>


<div className="text-center mt-8">
<a href="#" className="inline-block bg-black text-white px-5 py-3 rounded-xl">View More</a>
</div>
</section>
);
}
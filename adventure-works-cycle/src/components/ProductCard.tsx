import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";


export default function ProductCard({ p }: { p: Product }){
const { add } = useCart();
return (
<article className="bg-white rounded-2xl border shadow-sm hover:shadow-md transition overflow-hidden">
<div className="h-44 bg-neutral-50 grid place-items-center">
<img src={p.image} alt={p.name} className="h-full w-full object-cover"/>
</div>
<div className="p-4">
<h3 className="font-semibold">{p.name}<span className="text-xs text-neutral-500 ml-1">{p.brand}</span></h3>
<div className="text-amber-500 text-sm">{"★★★★★".slice(0, p.rating || 5)}</div>
<div className="mt-2 flex items-center justify-between">
<span className="font-bold">${p.price.toFixed(2)}</span>
{p.stock === "low" && <span className="text-[11px] text-rose-500">Almost Sold Out</span>}
</div>
<button onClick={()=>add(p)} className="mt-3 w-full rounded-lg border px-3 py-2 text-sm hover:bg-black hover:text-white transition">Add to cart</button>
</div>
</article>
);
}
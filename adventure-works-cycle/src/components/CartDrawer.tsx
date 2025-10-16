import { useCart } from "@/context/CartContext";


export default function CartDrawer({ open, onClose }:{ open:boolean; onClose:()=>void }){
const { items, setQty, remove, subtotal, clear } = useCart();
return (
<div className={`fixed inset-0 z-50 ${open?"":"pointer-events-none"}`}>
<div className={`absolute inset-0 bg-black/40 transition-opacity ${open?"opacity-100":"opacity-0"}`} onClick={onClose} />
<aside className={`absolute right-0 top-0 h-full w-[400px] max-w-[90%] bg-white p-4 shadow-xl transition-transform ${open?"translate-x-0":"translate-x-full"}`}>
<div className="flex items-center justify-between">
<h3 className="text-lg font-bold">Your Cart</h3>
<button onClick={onClose}>✕</button>
</div>
<div className="mt-4 space-y-3 max-h-[65vh] overflow-auto">
{items.length===0 && <p className="text-sm text-neutral-500">Your cart is empty.</p>}
{items.map(it=> (
<div key={it.id} className="flex gap-3 items-center border rounded-lg p-2">
<img src={it.image} className="w-16 h-16 object-cover rounded"/>
<div className="flex-1">
<p className="font-medium text-sm">{it.name}</p>
<p className="text-xs text-neutral-500">${it.price.toFixed(2)}</p>
<div className="flex items-center gap-2 mt-1">
<button className="px-2 border rounded" onClick={()=>setQty(it.id, Math.max(1, it.qty-1))}>-</button>
<span className="w-6 text-center text-sm">{it.qty}</span>
<button className="px-2 border rounded" onClick={()=>setQty(it.id, it.qty+1)}>+</button>
</div>
</div>
<button className="text-xs text-red-600" onClick={()=>remove(it.id)}>Remove</button>
</div>
))}
</div>
<div className="mt-4 border-t pt-3 flex items-center justify-between">
<span className="font-semibold">Subtotal</span>
<span className="font-bold">${subtotal.toFixed(2)}</span>
</div>
<div className="mt-3 flex gap-2">
<button onClick={clear} className="flex-1 border rounded-lg px-3 py-2">Clear</button>
<button className="flex-1 bg-black text-white rounded-lg px-3 py-2">Checkout</button>
</div>
</aside>
</div>
);
}
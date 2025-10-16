import React, { createContext, useContext, useMemo } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { Product } from "@/data/products";


export type CartItem = { id: string; name: string; price: number; image: string; qty: number };


type CartCtx = { items: CartItem[]; add:(p:Product, qty?:number)=>void; remove:(id:string)=>void; setQty:(id:string,qty:number)=>void; clear:()=>void; count:number; subtotal:number };
const Ctx = createContext<CartCtx | null>(null);


export const CartProvider: React.FC<{children:React.ReactNode}> = ({ children }) => {
const [items, setItems] = useLocalStorage<CartItem[]>("awc:cart", []);
const add:CartCtx["add"]=(p,qty=1)=>setItems(prev=>{ const i=prev.find(x=>x.id===p.id); return i? prev.map(x=>x.id===p.id?{...x,qty:x.qty+qty}:x):[...prev,{id:p.id,name:p.name,price:p.price,image:p.image,qty}]});
const remove=(id:string)=>setItems(prev=>prev.filter(x=>x.id!==id));
const setQty=(id:string,qty:number)=>setItems(prev=>prev.map(x=>x.id===id?{...x,qty}:x));
const clear=()=>setItems([]);
const {count,subtotal}=useMemo(()=>({count:items.reduce((a,b)=>a+b.qty,0),subtotal:items.reduce((a,b)=>a+b.qty*b.price,0)}),[items]);
return <Ctx.Provider value={{ items, add, remove, setQty, clear, count, subtotal }}>{children}</Ctx.Provider>;
};


export const useCart=()=>{ const c=useContext(Ctx); if(!c) throw new Error("useCart must be used within CartProvider"); return c; };
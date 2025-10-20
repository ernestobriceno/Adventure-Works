import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { API_URL, fetchJson } from "@/lib/api";
import type { Product } from "./Deals";


export default function NewArrivals() {
  const [items, setItems] = useState<Product[]>([]);
  const [error, setError] = useState<string>();

  useEffect(() => {
    // puedes pedir por tag=new, o por categoría si así lo decides
    fetchJson<Product[]>(`${API_URL}/api/products?tag=new`)
      .then(setItems)
      .catch((e) => setError(String(e.message || e)));
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="rounded-2xl bg-white border border-neutral-200 shadow-sm p-6">
        <h2 className="text-3xl font-extrabold">New Arrivals</h2>
        <p className="text-neutral-500">Lo más nuevo en la tienda.</p>

        {error && (
          <p className="mt-4 text-rose-600 text-sm break-all">{error}</p>
        )}

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {items.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

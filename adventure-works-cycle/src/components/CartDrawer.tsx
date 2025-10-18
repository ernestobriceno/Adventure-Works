import { useCart, getUnitPrice } from "@/context/CartContext";

type Props = { open: boolean; onClose: () => void };

export default function CartDrawer({ open, onClose }: Props) {
  const { items, inc, dec, remove, clear, subtotal } = useCart();

  return (
    <div
      className={[
        "fixed inset-0 z-50",
        open ? "pointer-events-auto" : "pointer-events-none"
      ].join(" ")}
      aria-hidden={!open}
    >
      {/* Backdrop */}
      <div
        className={[
          "absolute inset-0 bg-black/40 transition-opacity",
          open ? "opacity-100" : "opacity-0"
        ].join(" ")}
        onClick={onClose}
      />

      {/* Panel */}
      <aside
        className={[
          "absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transition-transform",
          open ? "translate-x-0" : "translate-x-full"
        ].join(" ")}
      >
        <header className="p-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-semibold">Your Cart</h3>
          <div className="flex items-center gap-3">
            <button onClick={clear} className="text-sm text-rose-600 hover:underline">
              Clear
            </button>
            <button onClick={onClose} className="text-sm text-neutral-500">
              Close
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-auto divide-y">
          {items.length === 0 ? (
            <div className="p-6 text-neutral-500">Your cart is empty.</div>
          ) : (
            items.map(({ product: p, qty }) => {
              const unit = getUnitPrice(p);
              const line = +(unit * qty).toFixed(2);
              const isDeal = p.tag === "deal";
              return (
                <div key={p.id} className="p-4 flex gap-3">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-20 h-20 object-contain bg-white border rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-medium leading-tight">
                          {p.name}{" "}
                          <span className="text-xs text-neutral-500">{p.brand}</span>
                        </div>
                        <div className="text-sm text-neutral-500 capitalize">
                          {p.category}
                          {p.tag ? ` · ${p.tag}` : ""}
                        </div>
                      </div>
                      <button
                        onClick={() => remove(p.id)}
                        className="text-sm text-neutral-500 hover:text-rose-600"
                      >
                        Remove
                      </button>
                    </div>

                    {/* Precio unitario (+ badge -25% si deal) */}
                    <div className="mt-2 flex items-center gap-2">
                      <span className="font-semibold">${unit.toFixed(2)}</span>
                      {isDeal && (
                        <>
                          <span className="text-neutral-400 line-through text-sm">
                            ${p.price.toFixed(2)}
                          </span>
                          <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-[2px]">
                            -25%
                          </span>
                        </>
                      )}
                    </div>

                    {/* Qty controls + total de línea */}
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={() => dec(p.id)}
                        className="w-7 h-7 border rounded hover:bg-neutral-50"
                        aria-label="Decrease"
                      >
                        −
                      </button>
                      <span className="w-8 text-center">{qty}</span>
                      <button
                        onClick={() => inc(p.id)}
                        className="w-7 h-7 border rounded hover:bg-neutral-50"
                        aria-label="Increase"
                      >
                        +
                      </button>
                      <span className="ml-auto text-sm text-neutral-600">
                        ${line.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Totales */}
        <footer className="p-4 border-t">
          <div className="flex items-center justify-between text-lg font-semibold">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <button className="mt-3 w-full rounded-lg bg-black text-white px-4 py-2 hover:bg-neutral-900">
            Checkout
          </button>
        </footer>
      </aside>
    </div>
  );
}

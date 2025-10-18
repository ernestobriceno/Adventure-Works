import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart, getUnitPrice } from "@/context/CartContext";

type Address = {
  email: string;
  country: string;
  firstName: string;
  lastName: string;
  line1: string;
  city: string;
  zip: string;
  sameForInvoice: boolean;
};

type Discount = {
  code: string;
  amount: number; // monto absoluto a restar
};

const SHIPPING_FLAT = 40; // como en tu mock

// Códigos de ejemplo (puedes quitarlos y validar en tu backend)
const KNOWN_CODES: Record<string, number> = {
  AWC10: 0.1, // 10% del subtotal
  AWC25: 0.25,
};

export default function Checkout() {
  const { items, subtotal, clear } = useCart();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/signin?next=/checkout");
    }
  }, [token, navigate]);

  // --------- ADDRESS ----------
  const [addr, setAddr] = useState<Address>({
    email: "",
    country: "US",
    firstName: "",
    lastName: "",
    line1: "",
    city: "",
    zip: "",
    sameForInvoice: false,
  });

  // --------- DISCOUNT ----------
  const [promoInput, setPromoInput] = useState("");
  const [discount, setDiscount] = useState<Discount>({ code: "", amount: 0 });
  const discountLabel = discount.code ? `${discount.code} (-$${discount.amount.toFixed(2)})` : "—";

  function applyDiscount() {
    const code = promoInput.trim().toUpperCase();
    if (!code) {
      setDiscount({ code: "", amount: 0 });
      return;
    }
    const pct = KNOWN_CODES[code];
    if (!pct) {
      setDiscount({ code: "", amount: 0 });
      return;
    }
    const amount = +(subtotal * pct).toFixed(2);
    setDiscount({ code, amount });
  }

  // --------- TOTALS ----------
  const shipping = useMemo(() => (items.length ? SHIPPING_FLAT : 0), [items.length]);
  const total = useMemo(
    () => Math.max(0, +(subtotal - discount.amount + shipping).toFixed(2)),
    [subtotal, discount.amount, shipping]
  );

  // --------- SUBMIT ----------
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submitOrder(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;

    if (!addr.email || !addr.firstName || !addr.lastName || !addr.line1 || !addr.city || !addr.zip || !addr.country) {
      setErr("Please complete all required fields.");
      return;
    }

    setLoading(true);
    setErr(null);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: items.map((it) => ({ productId: it.product.id, qty: it.qty })),
          address: {
            ...addr,
            name: `${addr.firstName} ${addr.lastName}`.trim(),
          },
          // meta opcional; si tu backend no lo usa, lo ignora sin romper
          discount: discount.code ? { code: discount.code, amount: discount.amount } : null,
          shipping,
          clientTotal: total,
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || `Request failed (${res.status})`);
      }
      const order = await res.json();
      clear();
      navigate(`/order/${order.id}`);
    } catch (e: any) {
      setErr(e.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  // --------- UI ----------
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT: Contact / Delivery / Payment */}
        <form onSubmit={submitOrder} className="lg:col-span-7 space-y-8">
          {/* Contact */}
          <div>
            <h2 className="text-3xl font-serif font-semibold">Contact</h2>
            <div className="mt-3">
              <div className="text-sm text-neutral-500">
                Have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/signup")}
                  className="underline"
                >
                  Create Account
                </button>
              </div>
              <input
                type="email"
                className="mt-4 w-full rounded-lg border px-3 py-2"
                placeholder="Email Address"
                value={addr.email}
                onChange={(e) => setAddr({ ...addr, email: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Delivery */}
          <div>
            <h2 className="text-3xl font-serif font-semibold">Delivery</h2>

            <div className="mt-4 grid grid-cols-1 gap-3">
              <div className="relative">
                <select
                  className="w-full rounded-lg border px-3 py-2 appearance-none"
                  value={addr.country}
                  onChange={(e) => setAddr({ ...addr, country: e.target.value })}
                  required
                >
                  <option value="US">United States</option>
                  <option value="SV">El Salvador</option>
                  <option value="MX">Mexico</option>
                  <option value="GT">Guatemala</option>
                  <option value="HN">Honduras</option>
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500">▾</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  className="rounded-lg border px-3 py-2"
                  placeholder="First Name"
                  value={addr.firstName}
                  onChange={(e) => setAddr({ ...addr, firstName: e.target.value })}
                  required
                />
                <input
                  className="rounded-lg border px-3 py-2"
                  placeholder="Last Name"
                  value={addr.lastName}
                  onChange={(e) => setAddr({ ...addr, lastName: e.target.value })}
                  required
                />
              </div>

              <input
                className="rounded-lg border px-3 py-2"
                placeholder="Address"
                value={addr.line1}
                onChange={(e) => setAddr({ ...addr, line1: e.target.value })}
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  className="rounded-lg border px-3 py-2"
                  placeholder="City"
                  value={addr.city}
                  onChange={(e) => setAddr({ ...addr, city: e.target.value })}
                  required
                />
                <input
                  className="rounded-lg border px-3 py-2"
                  placeholder="Postal Code"
                  value={addr.zip}
                  onChange={(e) => setAddr({ ...addr, zip: e.target.value })}
                  required
                />
              </div>

              <label className="mt-1 flex items-center gap-2 text-sm text-neutral-700">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border"
                  checked={addr.sameForInvoice}
                  onChange={(e) => setAddr({ ...addr, sameForInvoice: e.target.checked })}
                />
                Misma Información Que Factura
              </label>
            </div>
          </div>

          {/* Payment (solo UI mock) */}
          <div>
            <h2 className="text-3xl font-serif font-semibold">Payment</h2>

            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-2">
                <select className="rounded-lg border px-3 py-2">
                  <option>Credit Card</option>
                  <option>Debit Card</option>
                </select>
                <span className="text-xl">💳</span>
              </div>

              <input className="w-full rounded-lg border px-3 py-2" placeholder="Card Number" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input className="rounded-lg border px-3 py-2" placeholder="Expiration Date" />
                <input className="rounded-lg border px-3 py-2" placeholder="Security Code" />
              </div>
              <input className="w-full rounded-lg border px-3 py-2" placeholder="Card Holder Name" />

              <label className="flex items-center gap-2 text-sm text-neutral-700">
                <input type="checkbox" className="h-4 w-4 rounded border" />
                Save This Info For Future
              </label>
            </div>
          </div>

          {err && <p className="text-rose-600">{err}</p>}

          <button
            type="submit"
            disabled={loading || items.length === 0}
            className={[
              "w-full md:w-auto rounded-lg bg-black text-white px-6 py-3 font-medium",
              loading || items.length === 0 ? "opacity-60 cursor-not-allowed" : "hover:bg-neutral-900"
            ].join(" ")}
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>
        </form>

        {/* RIGHT: Order Summary */}
        <aside className="lg:col-span-5">
          <div className="rounded-2xl bg-neutral-50 border border-neutral-200 p-5">
            {/* Items */}
            <div className="space-y-4">
              {items.map(({ product: p, qty }) => {
                const unit = getUnitPrice(p);
                return (
                  <div key={p.id} className="flex items-center gap-3">
                    {/* Thumb con badge cantidad */}
                    <div className="relative">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-20 h-20 object-contain bg-white border rounded"
                      />
                      <span className="absolute -left-2 -top-2 inline-grid place-items-center w-5 h-5 rounded-full bg-red-600 text-white text-[11px] font-medium">
                        {qty}
                      </span>
                    </div>

                    <div className="flex-1">
                      <div className="font-medium leading-tight">
                        {p.name}
                      </div>
                      <div className="text-sm text-neutral-500">{p.brand}</div>
                    </div>

                    <div className="text-sm">
                      {p.tag === "deal" ? (
                        <>
                          <span className="font-semibold">${unit.toFixed(2)}</span>
                          <span className="ml-2 line-through text-neutral-400">${p.price.toFixed(2)}</span>
                        </>
                      ) : (
                        <span className="font-semibold">${unit.toFixed(2)}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Discount code */}
            <div className="mt-5 flex gap-3">
              <input
                className="flex-1 rounded-lg border px-3 py-2"
                placeholder="Discount code"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
              />
              <button
                type="button"
                onClick={applyDiscount}
                className="rounded-lg bg-black text-white px-5 py-2 hover:bg-neutral-900"
              >
                Apply
              </button>
            </div>

            {/* Totals */}
            <div className="mt-5 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Discount</span>
                <span>{discount.code ? discountLabel : "—"}</span>
              </div>
              <div className="pt-2 border-t flex items-center justify-between text-base font-semibold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

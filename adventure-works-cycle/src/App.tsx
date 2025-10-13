import React from "react";
import "./App.css";

/** Usa imágenes públicas para que funcione de inmediato.
 *  Luego puedes reemplazarlas por archivos locales en /src/assets si quieres.
 */
const IMG = {
  heroLeft: "https://images.unsplash.com/photo-1617744471896-5b3c2931d14b?q=80&w=1200&auto=format&fit=crop",
  heroSmall: "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1200&auto=format&fit=crop",
  heroRight: "https://images.unsplash.com/photo-1594007654729-407eedc4be65?q=80&w=1200&auto=format&fit=crop",
  heroBanner: "https://images.unsplash.com/photo-1511735111819-9a3f7709049c?q=80&w=1200&auto=format&fit=crop",
  bikes: [
    "https://images.unsplash.com/photo-1511735111819-9a3f7709049c?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1519415943484-9fa18778b51c?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?q=80&w=1200&auto=format&fit=crop",
  ],
  brands: [
    "MERIDA", "TREK", "HARO", "SANTA CRUZ", "cannondale"
  ]
};

/** Placeholder genérico por si no quieres cargar imágenes propias todavía */
const Ph = ({ className = "", src, alt }: { className?: string; src?: string; alt?: string }) => (
  src ? (
    <img src={src} alt={alt || "image"} className={`w-full h-full object-cover ${className}`} />
  ) : (
    <div className={`w-full h-full bg-neutral-200 ${className}`} />
  )
);

/** NAVBAR */
function Navbar() {
  const items = ["Home", "Deals", "New Arrivals", "Packages", "Sign in"];
  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur">
      <nav className="container py-6 flex items-center justify-between">
        <h1 className="text-3xl font-extrabold tracking-tight">AdventureWorksCycle</h1>
        <ul className="hidden md:flex items-center gap-8 text-gray-700">
          {items.map((it) => (
            <li key={it} className="nav-link">{it}</li>
          ))}
          <li><button className="btn-black">Sign Up</button></li>
        </ul>
        <button className="md:hidden btn-black">Menu</button>
      </nav>
    </header>
  );
}

/** HERO (3 columnas) */
function Hero() {
  return (
    <section className="container pt-8 pb-4">
      <div className="grid md:grid-cols-3 gap-5">
        {/* Izquierda */}
        <div className="card h-[420px] shadow-soft">
          <Ph src={IMG.heroLeft} alt="Bike Left" />
        </div>

        {/* Centro con 3 tarjetas */}
        <div className="flex flex-col gap-4">
          <div className="card h-[130px] shadow-soft">
            <Ph src={IMG.heroSmall} alt="Small Bike" />
          </div>

          <div className="card h-[220px] shadow-soft flex items-center justify-center text-center">
            <div className="px-6">
              <p className="text-sm tracking-widest text-gray-500">NEW COLLECTION</p>
              <h2 className="text-[64px] leading-none font-extrabold tracking-tight">
                ULTIMATE <span className="font-light">SALE</span>
              </h2>
              <button className="btn-black mt-4">SHOP NOW</button>
            </div>
          </div>

          <div className="card h-[70px] shadow-soft">
            <Ph src={IMG.heroBanner} alt="Accessory Banner" />
          </div>
        </div>

        {/* Derecha */}
        <div className="card h-[420px] shadow-soft">
          <Ph src={IMG.heroRight} alt="Bike Right" />
        </div>
      </div>

      {/* Botones flotantes (carrito / top) */}
      <div className="fixed right-5 bottom-24 flex flex-col gap-3">
        <button title="Cart" className="btn-black rounded-full w-12 h-12">🛒</button>
        <a href="#top" title="Top" className="btn-black rounded-full w-12 h-12">↑</a>
      </div>
    </section>
  );
}

/** MARCAS */
function Brands() {
  return (
    <section className="container py-8">
      <div className="flex flex-wrap items-center justify-between gap-10">
        {IMG.brands.map((b) => (
          <div key={b} className="h-8 flex items-center opacity-70 hover:opacity-100 transition">
            <span className="text-lg tracking-wide">{b}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/** DEALS */
function Deals() {
  return (
    <section className="bg-gray-50">
      <div className="container py-14">
        <h3 className="text-3xl font-bold">Deals Of The Month</h3>

        <div className="mt-8 grid md:grid-cols-[260px_1fr] gap-12 items-start">
          {/* Columna izquierda: CTA + contador estático */}
          <div className="space-y-6">
            <button className="btn-black w-40">Buy Now</button>
            <div>
              <p className="text-gray-600">Hurry, Before It’s Too Late!</p>

              <div className="mt-4 grid grid-cols-4 gap-3 text-center">
                {[
                  { n: "02", l: "Days" },
                  { n: "06", l: "Hr" },
                  { n: "05", l: "Mins" },
                  { n: "30", l: "Sec" },
                ].map((t) => (
                  <div key={t.l} className="bg-white rounded-xl shadow-soft py-3">
                    <div className="text-2xl font-extrabold">{t.n}</div>
                    <div className="text-xs text-gray-500">{t.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Carrusel scrollable sin librerías (funcional con mouse/trackpad) */}
          <div className="relative">
            {/* flechas */}
            <button
              className="absolute -left-6 top-1/2 -translate-y-1/2 z-10 btn-black rounded-full w-10 h-10"
              onClick={() => {
                const scroller = document.getElementById('scroller');
                if (scroller) scroller.scrollBy({ left: -320, behavior: 'smooth' });
              }}
            >‹</button>
            <button
              className="absolute -right-6 top-1/2 -translate-y-1/2 z-10 btn-black rounded-full w-10 h-10"
              onClick={() => {
                const scroller = document.getElementById('scroller');
                if (scroller) scroller.scrollBy({ left: 320, behavior: 'smooth' });
              }}
            >›</button>

            <div id="scroller" className="overflow-x-auto scroll-smooth">
              <div className="flex gap-6 min-w-max pr-4">
                {IMG.bikes.map((src, i) => (
                  <article key={i} className="relative w-[320px] shrink-0">
                    <div className="card h-[420px] shadow-soft bg-white">
                      <Ph src={src} alt={`Bike ${i + 1}`} className="h-[320px]" />
                      <div className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="badge">Q{String(i + 1).padStart(2, "0")}</span>
                          <span className="text-sm text-gray-500">Spring Sale</span>
                        </div>
                        <div className="mt-2 text-xl font-bold">30% OFF</div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* bullets */}
            <div className="flex items-center gap-2 mt-6 justify-center">
              <span className="dot dot-active" />
              <span className="dot" />
              <span className="dot" />
              <span className="dot" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** FOOTER */
function Footer() {
  return (
    <footer className="container py-12 text-sm text-gray-500">
      <div className="border-t pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p>© {new Date().getFullYear()} AdventureWorksCycle. All rights reserved.</p>
        <div className="flex gap-6">
          <a className="hover:text-black" href="#">Privacy</a>
          <a className="hover:text-black" href="#">Terms</a>
          <a className="hover:text-black" href="#">Support</a>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <div id="top">
      <Navbar />
      <Hero />
      <Brands />
      <Deals />
      <Footer />
    </div>
  );
}

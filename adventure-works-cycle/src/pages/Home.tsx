// src/pages/Home.tsx
import Deals from "@/components/Deals";

export default function Home() {
  // Card blanco reutilizable (definido aquí mismo para no crear archivos nuevos)
  const WhiteCard = ({
    className = "",
    children,
  }: {
    className?: string;
    children: React.ReactNode;
  }) => (
    <div
      className={
        "rounded-2xl bg-white border border-neutral-200 shadow-sm overflow-hidden " +
        className
      }
    >
      {children}
    </div>
  );

  const scrollToDeals = () => {
    const el = document.getElementById("deals");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="w-full">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* ====== HERO GRID (2 filas x 3 columnas en desktop) ====== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Fila 1 - Izquierda */}
          <WhiteCard className="h-[320px] sm:h-[360px] grid place-items-center">
            <img
              src="/biciblanca.jpg"
              alt="Bici blanca"
              className="w-full h-full object-contain"
            />
          </WhiteCard>

          {/* Fila 1 - Centro -> ULTIMATE SALE */}
          <WhiteCard className="h-[320px] sm:h-[360px] grid place-items-center text-center">
            <div className="px-6">
              <h2
                className="text-5xl sm:text-6xl font-extrabold tracking-tight
                           bg-gradient-to-b from-neutral-800 to-neutral-500
                           bg-clip-text text-transparent"
              >
                ULTIMATE
              </h2>
              <h3
                className="mt-1 text-6xl sm:text-7xl md:text-8xl font-extrabold leading-none
                           bg-gradient-to-b from-neutral-800 via-neutral-600 to-neutral-400
                           bg-clip-text text-transparent"
              >
                SALE
              </h3>
              <p className="mt-3 text-xs sm:text-sm uppercase tracking-[0.35em] text-neutral-400">
                New Collection
              </p>
              <button
                onClick={scrollToDeals}
                className="mt-6 inline-flex items-center justify-center
                           px-6 py-3 rounded-xl bg-black text-white font-semibold
                           shadow-[0_8px_20px_rgba(0,0,0,0.18)]
                           hover:bg-neutral-900 active:translate-y-[1px] transition"
                aria-label="Shop Now"
              >
                SHOP NOW
              </button>
            </div>
          </WhiteCard>

          {/* Fila 1 - Derecha */}
          <WhiteCard className="h-[320px] sm:h-[360px] grid place-items-center">
            <img
              src="/biciverde.jpg"
              alt="Bici verde"
              className="w-full h-full object-contain"
            />
          </WhiteCard>

          {/* Fila 2 - Izquierda */}
          <WhiteCard className="h-[320px] sm:h-[360px] grid place-items-center">
            <img
              src="/biciroja.jpg"
              alt="Bici roja"
              className="w-full h-full object-contain"
            />
          </WhiteCard>

          {/* Fila 2 - Centro */}
          <WhiteCard className="h-[320px] sm:h-[360px] grid place-items-center">
            <img
              src="/bicinegra.jpg"
              alt="Bici negra"
              className="w-full h-full object-contain"
            />
          </WhiteCard>

          {/* Fila 2 - Derecha */}
          <WhiteCard className="h-[320px] sm:h-[360px] grid place-items-center">
            <img
              src="/biciterreno.jpg"
              alt="Bici de terreno"
              className="w-full h-full object-contain"
            />
          </WhiteCard>
        </div>

        {/* ====== STRIP DE LOGOS (imagen única) ====== */}
        <WhiteCard className="px-6 py-4 flex justify-center">
          <img
            src="/logos.jpg"
            alt="Marcas"
            className="w-full h-auto object-contain rounded-xl"
          />
        </WhiteCard>

        {/* ====== DEALS ====== */}
        <div id="deals">
          <Deals />
        </div>
      </section>
    </div>
  );
}

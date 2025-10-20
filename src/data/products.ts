// Tipado de producto
export type Product = {
  id: string;
  name: string;
  price: number;
  brand: string;
  image: string;
  tag?: "new" | "deal";
  rating?: number;
  stock?: "ok" | "low" | "out"; // usado por tus componentes actuales
  category: "mountain" | "hybrid" | "bmx" | "electric";
  // NUEVO
  description: string;
  stockCount: number; // cantidad real de unidades
};

// Lista de productos
export const products: Product[] = [
  {
    id: "1",
    name: "Galleze Hybrid",
    price: 7000.0,
    brand: "Galleze",
    image: "/gallezehybrid.jpg",
    tag: "new",
    rating: 5,
    // Querías “Almost sold out” para <=5
    stock: "low",
    stockCount: 4,
    category: "hybrid",
    description:
      "Bicicleta híbrida premium con batería de larga duración y cuadro ultraligero para ciudad y carretera.",
  },
  {
    id: "2",
    name: "Merida",
    price: 600.5,
    brand: "MERIDA",
    image: "/merida.png",
    rating: 5,
    // Mantener como SOLD OUT
    stock: "out",
    stockCount: 0,
    category: "mountain",
    description:
      "Montañera resistente y confiable, con transmisión suave y frenos listos para todo terreno.",
  },
  {
    id: "3",
    name: "Maxxis",
    price: 6050.0,
    brand: "Maxxis",
    image: "/maxxis.png",
    rating: 5,
    tag: "deal",
    stock: "ok",
    stockCount: 18,
    category: "mountain",
    description:
      "Modelo deportivo con suspensión avanzada y componentes de alto rendimiento para rutas exigentes.",
  },
  {
    id: "4",
    name: "BMX Swift",
    price: 6050.0,
    brand: "BMX",
    image: "/bmxswft.png",
    rating: 5,
    stock: "ok",
    stockCount: 7,
    category: "bmx",
    description:
      "BMX ágil y robusta, ideal para trucos y saltos urbanos gracias a su estructura reforzada.",
  },
  {
    id: "5",
    name: "E-Bike",
    price: 600.5,
    brand: "Enguie",
    image: "/enguiee-bike.png",
    rating: 5,
    tag: "deal",
    stock: "ok",
    stockCount: 22,
    category: "electric",
    description:
      "Bicicleta eléctrica compacta con motor eficiente y excelente autonomía para desplazamientos diarios.",
  },
  {
    id: "6",
    name: "Trek Classic",
    price: 1050,
    brand: "Trek",
    image: "/treknormal.png",
    rating: 5,
    tag: "deal",
    // Mantener como SOLD OUT
    stock: "out",
    stockCount: 0,
    category: "mountain",
    description:
      "Diseño clásico con cuadro duradero y transmisión optimizada para salidas largas y cómodas.",
  },
  {
    id: "7",
    name: "Felt MBK",
    price: 2500,
    brand: "FELT",
    image: "/feltmbk.png",
    tag: "new",
    rating: 5,
    stock: "low",
    stockCount: 3,
    category: "mountain",
    description:
      "Combinación de ligereza y potencia, perfecta para ciclistas que buscan respuesta inmediata.",
  },
  {
    id: "8",
    name: "Sharo Bike",
    price: 600.5,
    brand: "Sharo",
    image: "/sharobike.png",
    rating: 5,
    stock: "ok",
    stockCount: 15,
    category: "hybrid",
    description:
      "Geometría cómoda y diseño aerodinámico para un rendimiento notable en entornos urbanos.",
  },
  {
    id: "9",
    name: "Trek MBK",
    price: 1050,
    brand: "Trek",
    image: "/trekmbk.png",
    rating: 5,
    tag: "deal",
    stock: "ok",
    stockCount: 11,
    category: "mountain",
    description:
      "Versión mejorada con frenos hidráulicos y componentes profesionales para máxima seguridad.",
  },
  {
    id: "10",
    name: "Polygon",
    price: 2550.5,
    brand: "MERIDA",
    image: "/meridapolygon.png",
    rating: 5,
    stock: "low",
    stockCount: 5,
    category: "mountain",
    description:
      "Cuadro de aluminio y postura ergonómica para una experiencia de pedaleo cómoda y eficiente.",
  },
];

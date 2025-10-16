import Hero from "@/components/Hero";
import Deals from "@/components/Deals";
import NewArrivals from "@/components/NewArrivals";

export default function Home() {
  return (
    <div className="flex flex-col gap-24">
      <Hero />
      <Deals />
      <NewArrivals />
    </div>
  );
}

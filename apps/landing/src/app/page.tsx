import { Navbar } from "@/components/sections/navbar";
import { Hero } from "@/components/sections/hero";
import { Sobre } from "@/components/sections/sobre";
import { Banda } from "@/components/sections/banda";
import { Servicos } from "@/components/sections/servicos";
import { Viveiro } from "@/components/sections/viveiro";
import { Footer } from "@/components/sections/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Sobre />
        <Banda />
        <Servicos />
        <Viveiro />
      </main>
      <Footer />
    </>
  );
}

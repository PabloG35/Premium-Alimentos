import Layout from "@/components/Layout";
import Section from "../components/Section";
import BrandsSection from "./home/BrandsSection";
import ExtraInfo from "@/pages/home/ExtraInfo";
import FavDelMes from "@/pages/home/FavDelMes";
import HeroCarousel from "./home/HeroCarousel";
import ProductosRecientes from "@/pages/home/ProductosRecientes";
import Reviews from "@/pages/home/Reviews";
import TextoEnMovimiento from "@/pages/home/TextoEnMovimiento";

export default function Home() {
  return (
    <>
      <HeroCarousel />
      <Layout>
        <Section>
          <BrandsSection />
        </Section>
        <Section>
          <ProductosRecientes />
        </Section>
        <TextoEnMovimiento />
        <Section>
          <Reviews />
        </Section>
        <Section>
          <FavDelMes />
        </Section>
        <Section >
          <ExtraInfo />
        </Section>
      </Layout>
    </>
  );
}

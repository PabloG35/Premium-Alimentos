import Layout from "@/src/components/Layout";
import Section from "@/src/components/Section";
import BrandsSection from "@/src/pages/home/BrandsSection";
import ExtraInfo from "@/src/pages/home/ExtraInfo";
import FavDelMes from "@/src/pages/home/FavDelMes";
import HeroCarousel from "@/src/pages/home/HeroCarousel";
import ProductosRecientes from "@/src/pages/home/ProductosRecientes";
import Reviews from "@/src/pages/home/Reviews";
import TextoEnMovimiento from "@/src/pages/home/TextoEnMovimiento";


export default function Home() {
  return (
    <>
      <HeroCarousel />
      <Layout>
        <BrandsSection/>
        <FavDelMes />
        <TextoEnMovimiento />
        <ProductosRecientes />
        <Reviews />
        <ExtraInfo />
      </Layout>
    </>
  );
}

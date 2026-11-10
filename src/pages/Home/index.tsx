import AboutContact from './sections/AboutContact';
import BoardSection from './sections/BoardSection';
import PriceCategories from './sections/PriceCategories';
import QuoteHero from './sections/QuoteHero';
import SellMethods from './sections/SellMethods';
import ServerCta from './sections/ServerCta';
import TrustStats from './sections/TrustStats';

export default function HomePage() {
  return (
    <>
      <QuoteHero />
      <SellMethods />
      <TrustStats />
      <PriceCategories />
      <BoardSection />
      <ServerCta />
      <AboutContact />
    </>
  );
}

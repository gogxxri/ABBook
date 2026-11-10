import AboutContact from './sections/AboutContact';
import BoardSection from './sections/BoardSection';
import Faq from './sections/Faq';
import GradeGuide from './sections/GradeGuide';
import PriceCategories from './sections/PriceCategories';
import QuoteHero from './sections/QuoteHero';
import SellMethods from './sections/SellMethods';
import SellProcess from './sections/SellProcess';

export default function HomePage() {
  return (
    <>
      <QuoteHero />
      <SellProcess />
      <SellMethods />
      <GradeGuide />
      <PriceCategories />
      <BoardSection />
      <Faq />
      <AboutContact />
    </>
  );
}

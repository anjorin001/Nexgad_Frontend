import Footer from "../components/Footer";
import GlobalOrderingSection from "../components/GlobalOrderingSection copy";
import HeroSection from "../components/HeroSection";
import LatestListings from "../components/LatestListings";
import PopularCategories from "../components/PopularCategory";

const Home = () => {
  return (
    <div>
      <HeroSection />
      <PopularCategories />
      <LatestListings />
      <GlobalOrderingSection />
      <Footer />
    </div>
  );
};

export default Home;

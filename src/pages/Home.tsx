import Footer from "../components/Footer";
import GlobalOrderingSection from "../components/GlobalOrderingSection copy";
import HeroSection from "../components/HeroSection";
import PopularCategories from "../components/PopularCategory";

const Home = () => {
  return (
    <div>
      <HeroSection />
          <PopularCategories />
          <GlobalOrderingSection/>
          <Footer/>
    </div>
  );
};

export default Home;

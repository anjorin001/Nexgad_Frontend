import { useEffect } from "react";
import Footer from "../components/Footer";
import GlobalOrderingSection from "../components/GlobalOrderingSection copy";
import HeroSection from "../components/HeroSection";
import LatestListings from "../components/LatestListings";
import PopularCategories from "../components/PopularCategory";
import { useAppContext } from "../context/AppContext";
import { useLandingPageRequest } from "../utils/landingPageRequest";
import NexgadLoader from "../components/nexgad-loader";

const Home = () => {
  const { handleFetchAll } = useLandingPageRequest();
  const { isLandingPageLoading } = useAppContext();

  useEffect(() => {
    handleFetchAll();
  }, []);

  return (
    <div>
      {isLandingPageLoading ? (
        <NexgadLoader />
      ) : (
        <>
          <HeroSection />
          <PopularCategories />
          <LatestListings />
          <GlobalOrderingSection />
          <Footer />
        </>
      )}
    </div>
  );
};

export default Home;

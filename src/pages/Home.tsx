import { useEffect } from "react";
import Footer from "../components/Footer";
import GlobalOrderingSection from "../components/GlobalOrderingSection copy";
import HeroSection from "../components/HeroSection";
import LatestListings from "../components/LatestListings";
import Loader from "../components/nexgadMidPageLoader";
import PopularCategories from "../components/PopularCategory";
import { useAppContext } from "../context/AppContext";
import { AddToWishlistRequest } from "../utils/AddToWishlistRequest";
import { useLandingPageRequest } from "../utils/landingPageRequest";

const Home = () => {
  const { handleFetchAll } = useLandingPageRequest();
  const { isLandingPageLoading, isListingLikeLoading } = useAppContext();

  const { handleLikeListing } = AddToWishlistRequest();

  useEffect(() => {
    handleFetchAll();
  }, []);


  return (
    <div>
      <HeroSection />
      {isLandingPageLoading ? (
        <div className="h-100 flex items-center justify-center">
          <Loader size={64} thickness={1} />
        </div>
      ) : (
        <>
          <PopularCategories />
          <LatestListings
            onListingLike={handleLikeListing}
            isListingLikeLoading={isListingLikeLoading}
          />
        </>
      )}
      <GlobalOrderingSection />
      <Footer />
    </div>
  );
};

export default Home;

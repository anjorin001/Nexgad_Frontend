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

  // const handleLikeListing = async (
  //   listingId: string,
  //   currentlyLiked: boolean
  // ) => {
  //   setIsListingLikeLoading(true);
  //   if (!isAuthenticated) {
  //     toast.info("", "login to add a product to wishlist");
  //     navigate("/register");
  //     setIsListingLikeLoading(false);
  //     return;
  //   }

  //   if (currentlyLiked) {
  //     try {
  //       const data = { ids: [listingId] };
  //       await api.delete(`/wishlist`, { data });

  //       setListings((prev) =>
  //         prev.map((p) => (p._id === listingId ? { ...p, liked: false } : p))
  //       );
  //       toast.success("", "product removed from wishlist");
  //     } catch (err) {
  //       console.error(err);
  //       toast.error(
  //         "",
  //         "An error occurred while removing from wishlist, try again later"
  //       );
  //     } finally {
  //       setIsListingLikeLoading(false);
  //     }
  //   } else {
  //     try {
  //       await api.post(`/wishlist/${listingId}`);

  //       setListings((prev) =>
  //         prev.map((p) => (p._id === listingId ? { ...p, liked: true } : p))
  //       );
  //       toast.success("", "product added to wishlist");
  //     } catch (err) {
  //       console.error(err);
  //       toast.error(
  //         "",
  //         "An error occurred while adding to wishlist, try again later"
  //       );
  //     } finally {
  //       setIsListingLikeLoading(false);
  //     }
  //   }
  // };

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

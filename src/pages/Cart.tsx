import CartPage from "../components/Cart";
import Footer from "../components/Footer";
import CompactProductGrid from "../components/OptListings";

const Cart = () => {
  return (
    <>
      <CartPage />
      <CompactProductGrid maxItems={4} showTitle={false} />
      <Footer />
    </>
  );
};

export default Cart;

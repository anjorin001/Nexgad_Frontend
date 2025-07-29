import { ProductDetailCtn } from "../components/ProductDetail";
import { dummyProduct } from "../helper/Dummyproduct";

const ProductDetail = () => {
  return (
    <ProductDetailCtn //TODO take th folloeing below away to productdeatilctn ... make use of useparams to get product id  and fetch product from db... the rest of the on props should make use of the id.
      product={dummyProduct}
      onAddToCart={(id) => console.log("Add to cart:", id)}
      onAddToWishlist={(id) => console.log("Add to wishlist:", id)}
      onReportItem={(id) => console.log("Report item:", id)}
    />
  );
};

export default ProductDetail;

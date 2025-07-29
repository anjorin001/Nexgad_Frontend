// hooks/useShareProduct.tsx
import { useAppContext } from "../context/AppContext";
import { shareProduct } from "../utils/ShareProduct";

export const useShareProduct = () => {
  const { setLinkCopied } = useAppContext();

  const handleShare = async (
    productId: string,
    title: string,
    price: number,
    slug: string
  ) => {
    const result = await shareProduct({
      productId,
      productTitle: title,
      productPrice: price,
      slug,
    });

    if (result === "copied") {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    }
  };

  return { handleShare };
};

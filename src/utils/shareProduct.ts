// utils/shareProduct.ts

import { formatPrice } from "./FormatPrice";

interface ShareProductOptions {
  productId: string;
  productTitle: string;
  productPrice: number;
  slug: string;
}

export const shareProduct = async ({
  productTitle,
  productPrice,
  slug,
}: ShareProductOptions): Promise<"shared" | "copied" | "error"> => {
  const productUrl = `${window.location.origin}/listings/${slug}`;

  try {
    if (navigator.share) {
      await navigator.share({
        title: productTitle,
        text: `Check out this ${productTitle} for ${formatPrice(productPrice)}`,
        url: productUrl,
      });
      return "shared";
    } else {
      await navigator.clipboard.writeText(productUrl);
      return "copied";
    }
  } catch (error) {
    console.error("Error sharing:", error);
    return "error";
  }
};

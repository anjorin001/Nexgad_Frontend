export enum ProductAvailability {
  IN_STOCK = "In Stock",
  OUT_OF_STOCK = "Out of Stock",
  LIMITED_STOCK = "Limited Stock",
}

export const getAvailabilityStyle = (availability: string) => {
  switch (availability) {
    case ProductAvailability.IN_STOCK:
      return {
        className:
          "inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-[#CBDCEB] text-[#1B3C53] border border-[#456882]/20",
        text: "In Stock",
      };
    case ProductAvailability.LIMITED_STOCK:
      return {
        className:
          "inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-yellow-50 text-yellow-800 border border-yellow-200",
        text: "Limited Stock",
      };
    case ProductAvailability.OUT_OF_STOCK:
      return {
        className:
          "inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200",
        text: "Out of Stock",
      };
    default:
      return {
        className:
          "inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-50 text-gray-600 border border-gray-200",
        text: "Unknown",
      };
  }
};

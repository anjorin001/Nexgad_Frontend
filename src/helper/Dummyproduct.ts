
export const dummyProduct: any = {
  id: "1",
  title: "MacBook Pro M2 14-inch - Space Gray",
  brand: "Apple",
  price: 850000,
  originalPrice: 1000000, //TODO optional for db
  condition: "Brand New",
  availability: "In Stock",
  category: "Laptops & Computers",
  description: `Brand new MacBook Pro with M2 chip delivers exceptional performance and battery life. Perfect for professionals, students, and creatives.

Key Features:
• M2 chip with 8-core CPU and 10-core GPU
• 14-inch Liquid Retina XDR display
• 16GB unified memory
• 512GB SSD storage
• Advanced camera and audio
• All-day battery life

This laptop comes with original packaging, charger, and all accessories. Never been used, sealed box condition.`,
  specifications: {
    Processor: "Apple M2 8-core CPU",
    Memory: "16GB Unified Memory",
    Storage: "512GB SSD",
    Display: "14-inch Liquid Retina XDR",
    Graphics: "10-core GPU",
    "Operating System": "macOS Ventura",
    "Battery Life": "Up to 17 hours",
    Weight: "1.6 kg",
    Warranty: "1 Year Apple Warranty",
  },
  images: [
    {
      id: "1",
      url: "/api/placeholder/600/600",
      alt: "MacBook Pro Front View",
    },
    {
      id: "2",
      url: "/api/placeholder/600/600",
      alt: "MacBook Pro Side View",
    },
    {
      id: "3",
      url: "/api/placeholder/600/600",
      alt: "MacBook Pro Open View",
    },
    // { id: "4", url: "/api/placeholder/600/600", alt: "MacBook Pro Ports" },
  ],
  location: {
    city: "Lagos",
    state: "Victoria Island",
  },
  seller: {
    name: "TechHub Store",
    rating: 4.8,
  },
  deliveryOptions: {
    pickup: true,
    delivery: true,
  },
  dateListeddays: 3,
  sku: "MBP-M2-14-SG-001",
  tags:["MacBook", "Laptop", "M2 Chip", "Professional", "Brand New"], //TODO when buildin backend understand diffualt values so you can prevent crashing of FE
};

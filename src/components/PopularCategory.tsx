import React, { type JSX } from "react";
import {
  FaAssistiveListeningSystems,
  FaCamera,
  FaClock,
  FaGamepad,
  FaHeadphones,
  FaLaptop,
  FaMobile,
  FaTv,
} from "react-icons/fa";
import { TvMinimal, HousePlug, TicketsPlane } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { ProductCategory } from "../enum/products.enum";
import { FaHouse } from "react-icons/fa6";
import { MdTv } from "react-icons/md";

type Category = {
  id: string;
  name: ProductCategory;
  icon: JSX.Element;
  count: number;
  color: string;
};

interface PopularCategoriesProps {
  onCategoryClick?: (categoryId: string) => void;
}

const PopularCategories: React.FC<PopularCategoriesProps> = () => {
  const navigate = useNavigate();
  const { categoryData, setAppliedFilter, setFilters } = useAppContext();

  const categoryConfig: Record<
    ProductCategory,
    { id: string; icon: JSX.Element; color: string }
  > = {
    [ProductCategory.SMARTPHONES_TABLETS]: {
      id: "Smartphones & Tablets",
      icon: <FaMobile className="text-2xl" />,
      color: "from-blue-500 to-blue-600",
    },
    [ProductCategory.LAPTOPS_COMPUTERS]: {
      id: "Laptops & Computers",
      icon: <FaLaptop className="Audio & Headphones" />,
      color: "from-purple-500 to-purple-600",
    },
    [ProductCategory.AUDIO_HEADPHONES]: {
      id: "Audio & Headphones",
      icon: <FaHeadphones className="text-2xl" />,
      color: "from-green-500 to-green-600",
    },
    [ProductCategory.GAMING_CONSOLES]: {
      id: "Gaming & Consoles",
      icon: <FaGamepad className="text-2xl" />,
      color: "from-red-500 to-red-600",
    },
    [ProductCategory.CAMERAS_PHOTOGRAPHY]: {
      id: "Cameras & Photography",
      icon: <FaCamera className="text-2xl" />,
      color: "from-yellow-500 to-orange-500",
    },
    [ProductCategory.WEARABLES]: {
      id: "Wearables",
      icon: <FaClock className="text-2xl" />,
      color: "from-pink-500 to-pink-600",
    },
    [ProductCategory.TV_ENTERTAINMENT]: {
      id: "TV & Entertainment",
      icon: <FaTv className="text-2xl" />,
      color: "from-teal-500 to-teal-600",
    },
    [ProductCategory.HOME_APPLIANCES]: {
      id: "Home Appliances",
      icon: <FaHouse className="text-2xl" />,
      color: "from-yellow-500 to-orange-500",
    },
    [ProductCategory.ACCESSORIES]: {
      id: "Accessories",
      icon: <FaAssistiveListeningSystems className="text-2xl" />,
      color: "from-pink-500 to-pink-600",
    },
    [ProductCategory.SMART_HOME]: {
      id: "Smart Home",
      icon:  <MdTv className="text-2xl"/>,
      color: "from-teal-500 to-teal-600",
    },
  };

  console.log("catcong", categoryConfig);
  const categories: Category[] = categoryData.map((c) => {
    const config = categoryConfig[c.category];

    return {
      id: config.id,
      name: c.category,
      icon: config.icon,
      count: c.count ?? 0,
      color: config.color,
    };
  });

  const handleCategoryClick = (categoryId: string) => {
    if (categoryId === "all") {
      navigate("/listings");
    } else {
      navigate(`/listings?category=${categoryId}`);
      setFilters({
        category: categoryId,
        priceRange: { min: "", max: "" },
        location: "",
        condition: "",
      });
      setAppliedFilter({
        category: categoryId,
        priceRange: { min: "", max: "" },
        location: "",
        condition: "",
      });
    }
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1B3C53] mb-4">
            Popular Categories
          </h2>
          <p className="text-lg text-[#456882] max-w-2xl mx-auto">
            Discover amazing deals on the latest gadgets and tech accessories
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className="group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#CBDCEB] to-white border border-[#456882]/10 hover:border-[#1B3C53]/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                {/* Gradient Overlay */}
                <div
                  className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${category.color} opacity-10 rounded-bl-full`}
                ></div>

                {/* Content */}
                <div className="relative p-6 text-center">
                  {/* Icon Container */}
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br ${category.color} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    {category.icon}
                  </div>

                  {/* Category Name */}
                  <h3 className="text-lg font-semibold text-[#1B3C53] mb-2 group-hover:text-[#456882] transition-colors duration-200">
                    {category.name}
                  </h3>

                  {/* Ads Count */}
                  <p className="text-sm text-[#456882]/70">
                    {category.count} ads
                  </p>
                </div>

                {/* Hover Effect Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#1B3C53]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button
            onClick={() => handleCategoryClick("all")}
            className="inline-flex items-center px-8 py-3 bg-[#1B3C53] text-white font-semibold rounded-xl hover:bg-[#456882] transition-all duration-200 hover:shadow-lg transform hover:scale-105"
          >
            View All Categories
            <svg
              className="ml-2 w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default PopularCategories;

import React from 'react';
import SearchBar from './SearcBar'; // Adjust path as needed

const HeroSection: React.FC = () => {
  const handleSearch = (searchTerm: string) => {
    // Handle your search logic here
    console.log('Searching for:', searchTerm);
    // You can redirect to search results page or filter products
  };

  return (
    <div className="bg-[#456882] w-full">
      {/* Hero Section */}
      <section className="py-10 px-0 sm:px-0 lg:px-0">
        <div className="max-w-7xl mx-auto text-center">
          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Buy & Sell Anything in Nigeria
          </h1>
          
          {/* Subheading */}
          <p className="text-xl sm:text-2xl text-white/90 mb-12 max-w-3xl mx-auto">
            Discover the best deals across the country on NexGad
          </p>
          
          {/* Search Bar */}
          <div className="max-w-4xl mx-auto">
            <SearchBar 
              onSearch={handleSearch}
              placeholder="What are you looking for?"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeroSection;
import {
  Edit,
  Eye,
  Filter,
  Package,
  Search,
  Star,
  Tag,
  Trash2,
} from "lucide-react";
import React, { useState } from "react";
import { DeleteModal } from "./Gadgets/deleteModal";
import { dummyData } from "../helpers/dummyData";
import { EditProductModal } from "./Gadgets/editModal";
import { ProductDetailsModal } from "./Gadgets/viewProductModel";

export interface ProductData {
  id: string;
  title: string;
  brand: string;
  price: number;
  originalPrice?: number;
  condition: "Brand New" | "Foreign Used" | "Nigerian Used" | "Refurbished";
  availability: "In Stock" | "Out of Stock" | "Limited Stock";
  quantity: number;
  category: string;
  description: string;
  specifications: { [key: string]: string };
  images: { url: string; alt: string; isPrimary: boolean }[];
  location: { city: string; state: string };
  seller: { name: string; rating?: number };
  deliveryOptions: { pickup: boolean; delivery: boolean };
  dateListeddays: number;
  sku: string;
  tags: string[];
  productType: "default" | "sponsored" | "featured";
}

export default function GadgetManagement() {
  const [products, setProducts] = useState<ProductData[]>(dummyData);
  const [filteredProducts, setFilteredProducts] =
    useState<ProductData[]>(dummyData);
  const [viewProduct, setViewProduct] = useState<ProductData | null>(null);
  const [editProduct, setEditProduct] = useState<ProductData | null>(null);
  const [editQuantity, setEditQuantity] = useState<number>(0);
  const [editProductType, setEditProductType] = useState<
    "default" | "sponsored" | "featured"
  >("default");

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("");
  const [selectedAvailability, setSelectedAvailability] = useState("");
  const [selectedProductType, setSelectedProductType] = useState("");
  const [showDeleteModal, setDeleteModal] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState<string>("");

  // Get unique values for filter options
  const categories = [...new Set(products.map((p) => p.category))];
  const brands = [...new Set(products.map((p) => p.brand))];
  const conditions = [...new Set(products.map((p) => p.condition))];
  const availabilities = [...new Set(products.map((p) => p.availability))];
  const productTypes = [...new Set(products.map((p) => p.productType))];

  // Apply filters
  React.useEffect(() => {
    const filtered = products.filter((product) => {
      const matchesSearch =
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        !selectedCategory || product.category === selectedCategory;
      const matchesBrand = !selectedBrand || product.brand === selectedBrand;
      const matchesCondition =
        !selectedCondition || product.condition === selectedCondition;
      const matchesAvailability =
        !selectedAvailability || product.availability === selectedAvailability;
      const matchesProductType =
        !selectedProductType || product.productType === selectedProductType;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesBrand &&
        matchesCondition &&
        matchesAvailability &&
        matchesProductType
      );
    });
    setFilteredProducts(filtered);
  }, [
    products,
    searchTerm,
    selectedCategory,
    selectedBrand,
    selectedCondition,
    selectedAvailability,
    selectedProductType,
  ]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedBrand("");
    setSelectedCondition("");
    setSelectedAvailability("");
    setSelectedProductType("");
  };

  const handleView = (product: ProductData) => {
    setViewProduct(product);
  };

  const handleEdit = (product: ProductData) => {
    setEditProduct(product);
    setEditQuantity(product.quantity);
    setEditProductType(product.productType);
  };

  const handleSaveEdit = () => {
    if (editProduct) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editProduct.id
            ? { ...p, quantity: editQuantity, productType: editProductType }
            : p
        )
      );
      setEditProduct(null);
    }
  };

  const handleDelete = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const getProductTypeColor = (type: string) => {
    switch (type) {
      case "featured":
        return "#e11d48";
      case "sponsored":
        return "#f59e0b";
      default:
        return "#456882";
    }
  };

  const getProductTypeIcon = (type: string) => {
    switch (type) {
      case "featured":
        return <Star className="w-3 h-3" />;
      case "sponsored":
        return <Tag className="w-3 h-3" />;
      default:
        return <Package className="w-3 h-3" />;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: "#263b51" }}>
          Manage Products
        </h1>
        <p className="text-gray-600">
          View, update, and manage your product inventory
        </p>
      </div>

      {/* Filters Section */}
      <div
        className="mb-6 bg-white rounded-lg border p-6"
        style={{ borderColor: "#CBDCEB" }}
      >
        <div className="flex items-center gap-3 mb-4">
          <Filter className="w-5 h-5" style={{ color: "#456882" }} />
          <h2 className="text-lg font-semibold" style={{ color: "#263b51" }}>
            Filters
          </h2>
          <div className="ml-auto">
            <button
              onClick={clearFilters}
              className="text-sm px-3 py-1 border rounded-md hover:bg-gray-50"
              style={{ borderColor: "#CBDCEB", color: "#456882" }}
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
              style={{ color: "#456882" }}
            />
            <input
              type="text"
              placeholder="Search products, brands, or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2"
              style={{ borderColor: "#CBDCEB" }}
            />
          </div>
        </div>

        {/* Filter Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: "#263b51" }}
            >
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
              style={{ borderColor: "#CBDCEB" }}
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: "#263b51" }}
            >
              Brand
            </label>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
              style={{ borderColor: "#CBDCEB" }}
            >
              <option value="">All Brands</option>
              {brands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: "#263b51" }}
            >
              Condition
            </label>
            <select
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
              style={{ borderColor: "#CBDCEB" }}
            >
              <option value="">All Conditions</option>
              {conditions.map((condition) => (
                <option key={condition} value={condition}>
                  {condition}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: "#263b51" }}
            >
              Availability
            </label>
            <select
              value={selectedAvailability}
              onChange={(e) => setSelectedAvailability(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
              style={{ borderColor: "#CBDCEB" }}
            >
              <option value="">All Availability</option>
              {availabilities.map((availability) => (
                <option key={availability} value={availability}>
                  {availability}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: "#263b51" }}
            >
              Product Type
            </label>
            <select
              value={selectedProductType}
              onChange={(e) => setSelectedProductType(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
              style={{ borderColor: "#CBDCEB" }}
            >
              <option value="">All Types</option>
              {productTypes.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-4 text-sm" style={{ color: "#456882" }}>
          Showing {filteredProducts.length} of {products.length} products
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-12">
            <Package className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              No products found
            </h3>
            <p className="text-gray-500">
              Try adjusting your filters or search terms
            </p>
          </div>
        ) : (
          filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg border shadow-sm overflow-hidden"
              style={{ borderColor: "#CBDCEB" }}
            >
              {/* Product Image */}
              <div className="h-48 bg-gray-100 overflow-hidden">
                <img
                  src={product.images[0]?.url}
                  alt={product.images[0]?.alt}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                    const fallback = target.nextSibling as HTMLElement;
                    if (fallback) fallback.style.display = "flex";
                  }}
                />
                <div className="w-full h-full items-center justify-center bg-gray-100 hidden">
                  <Package className="w-16 h-16 text-gray-400" />
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                {/* Product Type Badge */}
                <div className="mb-2">
                  <span
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-white"
                    style={{
                      backgroundColor: getProductTypeColor(product.productType),
                    }}
                  >
                    {getProductTypeIcon(product.productType)}
                    {product.productType}
                  </span>
                </div>

                <h3
                  className="font-semibold mb-2 line-clamp-2"
                  style={{ color: "#263b51" }}
                >
                  {product.title}
                </h3>

                <p className="text-sm text-gray-600 mb-2">{product.brand}</p>

                <div className="flex items-center gap-2 mb-2">
                  <span className="font-bold" style={{ color: "#263b51" }}>
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm" style={{ color: "#456882" }}>
                    Stock: {product.quantity}
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      product.availability === "In Stock"
                        ? "bg-green-100 text-green-800"
                        : product.availability === "Limited Stock"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {product.availability}
                  </span>
                </div>

                <div className="text-xs text-gray-500 mb-3">
                  SKU: {product.sku}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleView(product)}
                    className="flex-1 px-3 py-2 text-sm font-medium text-white rounded-md"
                    style={{ backgroundColor: "#456882" }}
                  >
                    <Eye className="w-4 h-4 mx-auto" />
                  </button>
                  <button
                    onClick={() => handleEdit(product)}
                    className="flex-1 px-3 py-2 text-sm font-medium border rounded-md"
                    style={{ borderColor: "#CBDCEB", color: "#456882" }}
                  >
                    <Edit className="w-4 h-4 mx-auto" />
                  </button>
                  <button
                    onClick={() => {
                      setDeleteModal(true);
                      setDeleteProductId(product.id);
                    }}
                    className="flex-1 px-3 py-2 text-sm font-medium text-red-600 border border-red-300 rounded-md hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mx-auto" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* View Modal */}
      {viewProduct && (
        <ProductDetailsModal
          show={!!viewProduct}
          product={viewProduct}
          onClose={() => setViewProduct(null)}
          formatPrice={formatPrice}
          getProductTypeColor={getProductTypeColor}
          getProductTypeIcon={getProductTypeIcon}
        />
      )}

      {/* Edit Modal */}
      {editProduct && (
        <EditProductModal
          show={!!editProduct}
          product={editProduct}
          quantity={editQuantity}
          productType={editProductType}
          onClose={() => setEditProduct(null)}
          onQuantityChange={setEditQuantity}
          onProductTypeChange={setEditProductType}
          onSave={handleSaveEdit}
        />
      )}

      {showDeleteModal && (
        <DeleteModal
          show={showDeleteModal}
          onClose={() => setDeleteModal(false)}
          onConfirm={() => deleteProductId && handleDelete(deleteProductId)}
          title="Are you sure you want to delete this product?"
        />
      )}
    </div>
  );
}

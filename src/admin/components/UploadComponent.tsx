/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  DollarSign,
  FileText,
  MapPin,
  Package,
  Plus,
  Settings,
  Truck,
  X,
  Upload,
  Image as ImageIcon,
  Star,
  Zap,
} from "lucide-react";
import React, { useState } from "react";

interface ProductImage {
  url: string;
  alt: string;
  isPrimary: boolean;
  file?: File;
}

interface ProductFormData {
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
  images: ProductImage[];
  location: {
    city: string;
    state: string;
  };
  productType: "default" | "sponsored" | "featured";
  deliveryOptions: {
    pickup: boolean;
    delivery: boolean;
  };
  sku: string;
  tags: string[];
}

export default function ProductUploadForm() {
  const [formData, setFormData] = useState<ProductFormData>({
    title: "",
    brand: "",
    price: 0,
    originalPrice: undefined,
    condition: "Brand New",
    availability: "In Stock",
    quantity: 1,
    category: "",
    description: "",
    specifications: {},
    images: [],
    productType: "default",
    location: { city: "", state: "" },
    deliveryOptions: { pickup: false, delivery: false },
    sku: "",
    tags: [],
  });

  const [newSpecKey, setNewSpecKey] = useState("");
  const [newSpecValue, setNewSpecValue] = useState("");
  const [newTag, setNewTag] = useState("");
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when field is updated
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const updateNestedField = (parent: string, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...((prev[parent as keyof ProductFormData] as object) ?? {}),
        [field]: value,
      },
    }));
    // Clear error when nested field is updated
    const errorKey = `${parent}.${field}`;
    if (errors[errorKey]) {
      setErrors(prev => ({
        ...prev,
        [errorKey]: ""
      }));
    }
  };

  const addSpecification = () => {
    if (newSpecKey && newSpecValue) {
      setFormData((prev) => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [newSpecKey]: newSpecValue,
        },
      }));
      setNewSpecKey("");
      setNewSpecValue("");
    }
  };

  const removeSpecification = (key: string) => {
    const newSpecs = { ...formData.specifications };
    delete newSpecs[key];
    setFormData((prev) => ({ ...prev, specifications: newSpecs }));
  };

  const addTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag],
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const currentImages = formData.images.length;
    const maxImages = 4;
    
    if (currentImages >= maxImages) {
      alert(`You can only upload a maximum of ${maxImages} images.`);
      return;
    }
    
    const remainingSlots = maxImages - currentImages;
    const filesToProcess = files.slice(0, remainingSlots);
    
    const newImages: ProductImage[] = filesToProcess.map((file, index) => ({
      url: URL.createObjectURL(file),
      alt: file.name,
      isPrimary: currentImages === 0 && index === 0,
      file: file
    }));
    
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages]
    }));
    
    // Clear image error if exists
    if (errors.images) {
      setErrors(prev => ({
        ...prev,
        images: ""
      }));
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => {
      const newImages = prev.images.filter((_, i) => i !== index);
      // If we removed the primary image and there are other images, make the first one primary
      if (prev.images[index].isPrimary && newImages.length > 0) {
        newImages[0].isPrimary = true;
      }
      return {
        ...prev,
        images: newImages
      };
    });
  };

  const setPrimaryImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.map((img, i) => ({
        ...img,
        isPrimary: i === index
      }))
    }));
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    // Required fields validation
    if (!formData.title.trim()) newErrors.title = "Product title is required";
    if (!formData.brand.trim()) newErrors.brand = "Brand is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.sku.trim()) newErrors.sku = "SKU is required";
    if (formData.price <= 0) newErrors.price = "Price must be greater than 0";
    if (formData.quantity < 0) newErrors.quantity = "Quantity cannot be negative";
    if (!formData.location.city.trim()) newErrors["location.city"] = "City is required";
    if (!formData.location.state.trim()) newErrors["location.state"] = "State is required";
    if (formData.images.length === 0) newErrors.images = "At least one image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      alert("Please fill in all required fields before submitting.");
      return;
    }

    console.log("Product Data:", formData);
    alert("Product submitted successfully!");
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: "#1B3C53" }}>
          Add New Product
        </h1>
        <p className="text-gray-600">
          Fill in the product details to add it to your store
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div
          className="bg-white rounded-lg border p-6"
          style={{ borderColor: "#CBDCEB" }}
        >
          <div className="flex items-center gap-3 mb-6">
            <Package className="w-5 h-5" style={{ color: "#456882" }} />
            <h2 className="text-xl font-semibold" style={{ color: "#1B3C53" }}>
              Basic Information
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "#1B3C53" }}
              >
                Product Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => updateFormData("title", e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors.title ? 'border-red-500' : ''}`}
                style={{ borderColor: errors.title ? "#ef4444" : "#CBDCEB" }}
                placeholder="Enter product title"
                required
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "#1B3C53" }}
              >
                Brand *
              </label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => updateFormData("brand", e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors.brand ? 'border-red-500' : ''}`}
                style={{ borderColor: errors.brand ? "#ef4444" : "#CBDCEB" }}
                placeholder="Enter brand name"
                required
              />
              {errors.brand && <p className="text-red-500 text-sm mt-1">{errors.brand}</p>}
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "#1B3C53" }}
              >
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => updateFormData("category", e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors.category ? 'border-red-500' : ''}`}
                style={{ borderColor: errors.category ? "#ef4444" : "#CBDCEB" }}
                required
              >
                <option value="">Select category</option>
                <option value="Smartphones & Tablets">
                  Smartphones & Tablets
                </option>
                <option value="Laptops & Computers">Laptops & Computers</option>
                <option value="Audio & Headphones">Audio & Headphones</option>
                <option value="Gaming & Consoles">Gaming & Consoles</option>
                <option value="Cameras & Photography">
                  Cameras & Photography
                </option>
                <option value="TV & Entertainment">TV & Entertainment</option>
                <option value="Accessories">Accessories</option>
                <option value="Smart Home">Smart Home</option>
                <option value="Wearables">Wearables</option>
              </select>
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "#1B3C53" }}
              >
                SKU *
              </label>
              <input
                type="text"
                value={formData.sku}
                onChange={(e) => updateFormData("sku", e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors.sku ? 'border-red-500' : ''}`}
                style={{ borderColor: errors.sku ? "#ef4444" : "#CBDCEB" }}
                placeholder="Enter SKU"
                required
              />
              {errors.sku && <p className="text-red-500 text-sm mt-1">{errors.sku}</p>}
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "#1B3C53" }}
              >
                Condition *
              </label>
              <select
                value={formData.condition}
                onChange={(e) => updateFormData("condition", e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                style={{ borderColor: "#CBDCEB" }}
              >
                <option value="Brand New">Brand New</option>
                <option value="Foreign Used">Foreign Used</option>
                <option value="Nigerian Used">Nigerian Used</option>
                <option value="Refurbished">Refurbished</option>
              </select>
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "#1B3C53" }}
              >
                Availability
              </label>
              <select
                value={formData.availability}
                onChange={(e) => updateFormData("availability", e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                style={{ borderColor: "#CBDCEB" }}
              >
                <option value="In Stock">In Stock</option>
                <option value="Out of Stock">Out of Stock</option>
                <option value="Limited Stock">Limited Stock</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: "#1B3C53" }}
            >
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => updateFormData("description", e.target.value)}
              rows={4}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors.description ? 'border-red-500' : ''}`}
              style={{ borderColor: errors.description ? "#ef4444" : "#CBDCEB" }}
              placeholder="Enter detailed product description"
              required
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>
        </div>

        {/* Product Type Selection */}
        <div
          className="bg-white rounded-lg border p-6"
          style={{ borderColor: "#CBDCEB" }}
        >
          <div className="flex items-center gap-3 mb-6">
            <Star className="w-5 h-5" style={{ color: "#456882" }} />
            <h2 className="text-xl font-semibold" style={{ color: "#1B3C53" }}>
              Product Type
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="productType"
                value="default"
                checked={formData.productType === "default"}
                onChange={(e) => updateFormData("productType", e.target.value)}
                className="mr-3"
                style={{ accentColor: "#456882" }}
              />
              <div>
                <div className="font-medium" style={{ color: "#1B3C53" }}>Default</div>
                <div className="text-sm text-gray-600">Regular product listing</div>
              </div>
            </label>

            <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="productType"
                value="sponsored"
                checked={formData.productType === "sponsored"}
                onChange={(e) => updateFormData("productType", e.target.value)}
                className="mr-3"
                style={{ accentColor: "#456882" }}
              />
              <div>
                <div className="font-medium flex items-center gap-2" style={{ color: "#1B3C53" }}>
                  <Zap className="w-4 h-4 text-yellow-500" />
                  Sponsored
                </div>
                <div className="text-sm text-gray-600">Promoted listing with better visibility</div>
              </div>
            </label>

            <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="productType"
                value="featured"
                checked={formData.productType === "featured"}
                onChange={(e) => updateFormData("productType", e.target.value)}
                className="mr-3"
                style={{ accentColor: "#456882" }}
              />
              <div>
                <div className="font-medium flex items-center gap-2" style={{ color: "#1B3C53" }}>
                  <Star className="w-4 h-4 text-blue-500" />
                  Featured
                </div>
                <div className="text-sm text-gray-600">Premium featured product</div>
              </div>
            </label>
          </div>
        </div>

        {/* Images Upload */}
        <div
          className="bg-white rounded-lg border p-6"
          style={{ borderColor: "#CBDCEB" }}
        >
          <div className="flex items-center gap-3 mb-6">
            <ImageIcon className="w-5 h-5" style={{ color: "#456882" }} />
            <h2 className="text-xl font-semibold" style={{ color: "#1B3C53" }}>
              Product Images *
            </h2>
          </div>

          <div className="mb-4">
            <label
              className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 ${formData.images.length >= 4 ? 'opacity-50 cursor-not-allowed' : ''}`}
              style={{ borderColor: errors.images ? "#ef4444" : "#CBDCEB" }}
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-2 text-gray-500" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB (Max 4 images)
                </p>
              </div>
              <input
                type="file"
                className="hidden"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                disabled={formData.images.length >= 4}
              />
            </label>
            {errors.images && <p className="text-red-500 text-sm mt-1">{errors.images}</p>}
          </div>

          {formData.images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {formData.images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <div className="flex gap-2">
                      {!image.isPrimary && (
                        <button
                          type="button"
                          onClick={() => setPrimaryImage(index)}
                          className="px-2 py-1 bg-blue-500 text-white text-xs rounded"
                        >
                          Set Primary
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="p-1 bg-red-500 text-white rounded"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  {image.isPrimary && (
                    <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                      Primary
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pricing & Inventory */}
        <div
          className="bg-white rounded-lg border p-6"
          style={{ borderColor: "#CBDCEB" }}
        >
          <div className="flex items-center gap-3 mb-6">
            <DollarSign className="w-5 h-5" style={{ color: "#456882" }} />
            <h2 className="text-xl font-semibold" style={{ color: "#1B3C53" }}>
              Pricing & Inventory
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "#1B3C53" }}
              >
                Price (₦) *
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) =>
                  updateFormData("price", parseFloat(e.target.value))
                }
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors.price ? 'border-red-500' : ''}`}
                style={{ borderColor: errors.price ? "#ef4444" : "#CBDCEB" }}
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "#1B3C53" }}
              >
                Original Price (₦)
              </label>
              <input
                type="number"
                value={formData.originalPrice || ""}
                onChange={(e) =>
                  updateFormData(
                    "originalPrice",
                    e.target.value ? parseFloat(e.target.value) : undefined
                  )
                }
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                style={{ borderColor: "#CBDCEB" }}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "#1B3C53" }}
              >
                Quantity *
              </label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) =>
                  updateFormData("quantity", parseInt(e.target.value))
                }
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors.quantity ? 'border-red-500' : ''}`}
                style={{ borderColor: errors.quantity ? "#ef4444" : "#CBDCEB" }}
                min="0"
                required
              />
              {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>}
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div
          className="bg-white rounded-lg border p-6"
          style={{ borderColor: "#CBDCEB" }}
        >
          <div className="flex items-center gap-3 mb-6">
            <Settings className="w-5 h-5" style={{ color: "#456882" }} />
            <h2 className="text-xl font-semibold" style={{ color: "#1B3C53" }}>
              Specifications
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              value={newSpecKey}
              onChange={(e) => setNewSpecKey(e.target.value)}
              className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
              style={{ borderColor: "#CBDCEB" }}
              placeholder="Specification name (e.g., RAM)"
            />
            <div className="flex gap-2">
              <input
                type="text"
                value={newSpecValue}
                onChange={(e) => setNewSpecValue(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                style={{ borderColor: "#CBDCEB" }}
                placeholder="Value (e.g., 8GB)"
              />
              <button
                type="button"
                onClick={addSpecification}
                className="px-4 py-2 text-white rounded-md font-medium"
                style={{ backgroundColor: "#456882" }}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {Object.entries(formData.specifications).map(([key, value]) => (
              <div
                key={key}
                className="flex items-center justify-between p-3 rounded-md"
                style={{ backgroundColor: "#CBDCEB20" }}
              >
                <span className="font-medium" style={{ color: "#1B3C53" }}>
                  {key}: {value}
                </span>
                <button
                  type="button"
                  onClick={() => removeSpecification(key)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Location & Seller */}
        <div
          className="bg-white rounded-lg border p-6"
          style={{ borderColor: "#CBDCEB" }}
        >
          <div className="flex items-center gap-3 mb-6">
            <MapPin className="w-5 h-5" style={{ color: "#456882" }} />
            <h2 className="text-xl font-semibold" style={{ color: "#1B3C53" }}>
              Location & Seller
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "#1B3C53" }}
              >
                City *
              </label>
              <input
                type="text"
                value={formData.location.city}
                onChange={(e) =>
                  updateNestedField("location", "city", e.target.value)
                }
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors["location.city"] ? 'border-red-500' : ''}`}
                style={{ borderColor: errors["location.city"] ? "#ef4444" : "#CBDCEB" }}
                placeholder="Enter city"
                required
              />
              {errors["location.city"] && <p className="text-red-500 text-sm mt-1">{errors["location.city"]}</p>}
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "#1B3C53" }}
              >
                State *
              </label>
              <input
                type="text"
                value={formData.location.state}
                onChange={(e) =>
                  updateNestedField("location", "state", e.target.value)
                }
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors["location.state"] ? 'border-red-500' : ''}`}
                style={{ borderColor: errors["location.state"] ? "#ef4444" : "#CBDCEB" }}
                placeholder="Enter state"
                required
              />
              {errors["location.state"] && <p className="text-red-500 text-sm mt-1">{errors["location.state"]}</p>}
            </div>
          </div>
        </div>

        {/* Delivery Options */}
        <div
          className="bg-white rounded-lg border p-6"
          style={{ borderColor: "#CBDCEB" }}
        >
          <div className="flex items-center gap-3 mb-6">
            <Truck className="w-5 h-5" style={{ color: "#456882" }} />
            <h2 className="text-xl font-semibold" style={{ color: "#1B3C53" }}>
              Delivery Options
            </h2>
          </div>

          <div className="space-y-4">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={formData.deliveryOptions.pickup}
                onChange={(e) =>
                  updateNestedField(
                    "deliveryOptions",
                    "pickup",
                    e.target.checked
                  )
                }
                className="rounded"
                style={{ accentColor: "#456882" }}
              />
              <span style={{ color: "#1B3C53" }}>Pickup Available</span>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={formData.deliveryOptions.delivery}
                onChange={(e) =>
                  updateNestedField(
                    "deliveryOptions",
                    "delivery",
                    e.target.checked
                  )
                }
                className="rounded"
                style={{ accentColor: "#456882" }}
              />
              <span style={{ color: "#1B3C53" }}>Delivery Available</span>
            </label>
          </div>
        </div>

        {/* Tags */}
        <div
          className="bg-white rounded-lg border p-6"
          style={{ borderColor: "#CBDCEB" }}
        >
          <div className="flex items-center gap-3 mb-6">
            <FileText className="w-5 h-5" style={{ color: "#456882" }} />
            <h2 className="text-xl font-semibold" style={{ color: "#1B3C53" }}>
              Tags
            </h2>
          </div>

          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
              style={{ borderColor: "#CBDCEB" }}
              placeholder="Enter tag"
              onKeyPress={(e) =>
                e.key === "Enter" && (e.preventDefault(), addTag())
              }
            />
            <button
              type="button"
              onClick={addTag}
              className="px-4 py-2 text-white rounded-md font-medium"
              style={{ backgroundColor: "#456882" }}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium"
                style={{ backgroundColor: "#CBDCEB", color: "#1B3C53" }}
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <button
            type="submit"
            className="px-6 py-3 text-white rounded-md font-medium hover:opacity-90 transition-opacity"
            style={{ backgroundColor: "#1B3C53" }}
          >
            Add Product
          </button>
        </div>
      </form>
    </div>
  );
}
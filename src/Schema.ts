// eslint-disable-next-line @typescript-eslint/no-require-imports
const mongoose = require('mongoose');

const productImageSchema = new mongoose.Schema({
  id: { type: String, required: true },
  url: { type: String, required: true },
  alt: { type: String, required: true }
});

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  brand: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  condition: { 
    type: String, 
    enum: ["Brand New", "Foreign Used", "Nigerian Used", "Refurbished"],
    required: true 
  },
  availability: { 
    type: String, 
    enum: ["In Stock", "Out of Stock", "Limited Stock"],
    required: true 
  },
  category: { type: String, required: true },
  description: { type: String, required: true },
  specifications: { type: Map, of: String },
  images: [productImageSchema],
  location: {
    city: { type: String, required: true },
    state: { type: String, required: true }
  },
  seller: {
    name: { type: String, required: true },
    rating: { type: Number, min: 0, max: 5 }
  },
  deliveryOptions: {
    pickup: { type: Boolean, default: false },
    delivery: { type: Boolean, default: false }
  },
  dateListeddays: { type: Number, required: true },
  sku: { type: String, required: true, unique: true },
  tags: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);


// const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  brand: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  image: { type: String, required: true }
});

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: {
    type: String,
    enum: ["pending", "processing", "shipped", "delivered", "cancelled", "returned"],
    default: "pending"
  },
  items: [orderItemSchema],
  totalAmount: { type: Number, required: true },
  orderDate: { type: Date, default: Date.now },
  deliveryDate: { type: Date },
  shippingAddress: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  trackingNumber: { type: String },
  seller: {
    name: { type: String, required: true },
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  estimatedDelivery: { type: Date },
  cancellationReason: { type: String },
  returnReason: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);

// const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  profilePicture: { type: String },
  defaultLocation: {
    city: { type: String, required: true },
    state: { type: String, required: true }
  },
  currency: { type: String, default: "NGN" },
  language: { type: String, default: "en" },
  joinedDate: { type: Date, default: Date.now },
  isVerified: { type: Boolean, default: false },
  role: { type: String, enum: ["user", "seller", "admin"], default: "user" }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);


// const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },
  addedAt: { type: Date, default: Date.now }
});

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [cartItemSchema],
  totalAmount: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);

// const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  products: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product' 
  }],
  lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Wishlist', wishlistSchema);
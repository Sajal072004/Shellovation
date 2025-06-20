const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const authRoutes = require('./routes/auth');
const uuid = require('uuid');
const bcrypt = require('bcrypt'); // Added bcrypt import
const Seller = require('./models/seller');
const adminAuthRoutes = require('./routes/adminauth'); 
const cartRoutes = require('./routes/cart');
const complaintsRoutes = require('./routes/complaints');
const couponRoutes = require('./routes/coupon')
const Product = require('./models/product');

const app = express();
const Order = require('./models/order');
const User = require('./models/user');
const Address = require('./models/address');

const JWT_SECRET = 'your-secret-key'


// Middleware
app.use(cors({
  origin: [' http://localhost:5173', 'http://localhost:3000', 'http://localhost:3000/signup','https://merabestie-orpin.vercel.app','https://merabestie-khaki.vercel.app','https://merabestie.com','https://hosteecommerce.vercel.app'], // Frontend URLs
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());
app.use(require('cookie-parser')());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
      collectionName: 'sahiba',
    }),
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  })
);

// Routes
app.use('/auth', authRoutes);
app.use('/admin', adminAuthRoutes);
app.use('/cart', cartRoutes);
app.use('/complaints', complaintsRoutes);
app.use('/coupon',couponRoutes)

// MongoDB Connection
const uri = process.env.MONGO_URL;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));


// Keep-Alive Route
app.get('/keep-alive', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is up and running'
  });
});


app.post('/product/category', async (req, res) => {
  try {
    const { category } = req.body;
    
    
    let normalizedCategory = category.toLowerCase();
    let searchCategory;

   
    switch(normalizedCategory) {
      case 'gift-boxes':
      case 'gift boxes':
        searchCategory = 'Gift Boxes';
        break;
      case 'books':
        searchCategory = 'Books';
         break;
      case 'stationery':
        searchCategory = 'Stationery';
        break;
      default:
        searchCategory = category;
    }
    
    const products = await Product.find({ category: searchCategory });

    res.status(200).json({
      success: true,
      products
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching products by category',
      error: error.message
    });
  }
});



app.post('/create-product', async (req, res) => {
  try {
    const productData = req.body;
    const product = new Product(productData);
    const result = await product.save();
    
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating product',
      error: error.message
    });
  }
});


app.get('/get-product', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({
      success: true,
      products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
});


app.put('/update-visibility', async (req, res) => {
  try {
    console.log("update-visibility url is hit");
    const { productId, visibility } = req.body;

    const updatedProduct = await Product.findOneAndUpdate(
      { productId: productId },
      { $set: { visibility: visibility } },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product visibility updated successfully',
      product: updatedProduct
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating product visibility',
      error: error.message
    });
  }
});



app.get('/product/:productId', async (req, res) => {
  try {
    console.log("product/productId url is hit");
    const { productId } = req.params;
    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false, 
      message: 'Error fetching product',
      error: error.message
    });
  }
});

app.post('/instock-update', async (req, res) => {
  try {
    console.log("instock update url is hit");
    const { productId, inStockValue, soldStockValue } = req.body;

    // Find and update the product
    const updatedProduct = await Product.findOneAndUpdate(
      { productId: productId },
      {
        $set: {
          inStockValue: inStockValue,
          soldStockValue: soldStockValue
        }
      },
      { new: true, upsert: false }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Stock status updated successfully',
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating stock status',
      error: error.message
    });
  }
});


app.get('/assign-productid', async (req, res) => {
  try {
    // Find all products
    const products = await Product.find();
    
    if (products.length === 0) {
      return res.status(404).send('No products found to assign productIds.');
    }

    // Update each product to add a productId
    const updatedProducts = [];
    const usedIds = new Set(); // Track used IDs to ensure uniqueness

    for (const product of products) {
      let productId;
      // Generate unique 6 digit number
      do {
        productId = Math.floor(100000 + Math.random() * 900000).toString();
      } while (usedIds.has(productId));
      
      usedIds.add(productId);

      const updateResult = await Product.findOneAndUpdate(
        { _id: product._id },
        { $set: { productId } },
        { new: true }
      );

      if (updateResult) {
        updatedProducts.push(updateResult);
      } else {
        console.error(`Failed to update product with ID: ${product._id}`);
      }
    }

    // Save all updated products
    await Promise.all(updatedProducts.map(product => product.save()));

    res.status(200).json({
      success: true,
      message: 'Product IDs assigned successfully',
      products: updatedProducts
    });
  } catch (err) {
    console.error('Error during product ID assignment:', err);
    res.status(500).json({
      success: false,
      message: 'Error assigning product IDs',
      error: err.message
    });
  }
});


// Update or Create Address Route
app.post('/update-address', async (req, res) => {
  try {
    const { userId, address } = req.body;

    // Try to find existing address for user
    const existingAddress = await Address.findOne({ userId });

    let result;
    if (existingAddress) {
      // Update existing address
      existingAddress.address = address;
      result = await existingAddress.save();
    } else {
      // Create new address entry
      const newAddress = new Address({
        userId,
        address
      });
      result = await newAddress.save();
    }

    res.status(200).json({
      success: true,
      message: 'Address updated successfully',
      address: result
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating address',
      error: error.message
    });
  }
});


// Place Order Route
// Get All Orders Route
app.get('/get-orders', async (req, res) => {
  try {
    const orders = await Order.find();
    
    res.status(200).json({
      success: true,
      orders
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
});

// Get User Details Route
app.get('/get-user', async (req, res) => {
  try {
    const users = await mongoose.model('User').find(
      {}, // Remove filter to get all users
      '-password' // Exclude only the password field
    );
    
    res.status(200).json({
      success: true,
      users
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user details',
      error: error.message
    });
  }
});

// Update Account Status Route
app.put('/update-account-status', async (req, res) => {
  try {
    const { userId, accountStatus } = req.body;

    // Find and update the user, and get the updated document
    const updatedUser = await mongoose.model('User').findOneAndUpdate(
      { userId: userId },
      { accountStatus },
      { new: true } // This option returns the modified document rather than the original
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Account status updated successfully',
      user: {
        userId: updatedUser.userId,
        accountStatus: updatedUser.accountStatus
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating account status',
      error: error.message
    });
  }
});

const otpStore = new Map();



// GET /get-current-user route to find the user by token
app.post('/get-current-user', async (req, res) => {
  try {
    // Extract userId from the request body
    const { userId } = req.body; 

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Find the user using the provided userId
    const user = await User.findOne({ userId: userId });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return user info (you can choose what info to return)
    res.json({
      userId: user._id,
      name: user.name,
      email: user.email,
      accountStatus: user.accountStatus,
      phone: user.phone
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


app.post('/find-my-order', async (req, res) => {
  try {
    console.log("find my order url is being hit");
    const { userId } = req.body;
    console.log("The user ID is:", userId);

    
    if (!userId) {
      console.log("user id not found ");
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    // Find the user by userId
    const user = await User.findOne({ userId });
    if (!user) {
      console.log("the user is not found");
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    console.log("User found:", user);  // Log user details

    // Find the orders for the given user using user._id
    const orders = await Order.find({ userId: user._id });

    console.log("The orders are", orders);
  
    
    if (!orders || orders.length === 0) {
      return res.status(200).json({
        success: false,
        message: 'No orders found for this user'
      });
    }

    const findProductDetails = async (productsOrdered) => {
      try {
        const productDetails = [];

        // Loop through each product in the order
        for (const { productId, quantity } of productsOrdered) {
          try {
            // Fetch the product details from the Product model
            const product = await Product.findById(productId);
            if (product) {
              productDetails.push({
                ...product.toObject(),
                quantity  // Attach quantity to the product details
              });
            }
          } catch (err) {
            console.error(`Error fetching product ${productId}:`, err);
          }
        }

        return productDetails;
      } catch (error) {
        throw new Error('Error fetching product details: ' + error.message);
      }
    };

    // Get product details for each order
    const ordersWithProducts = await Promise.all(
      orders.map(async (order) => {
        // Ensure the order's `productsOrdered` field is passed
        const productDetails = await findProductDetails(order.productsOrdered);
        return {
          ...order.toObject(),
          products: productDetails  // Include the product details in the order
        };
      })
    );

    // Send back the response with orders and their corresponding product details
    res.status(200).json({
      success: true,
      orders: ordersWithProducts
    });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      message: 'Error finding orders',
      error: error.message
    });
  }
});





const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

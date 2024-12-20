"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch cart items from the backend
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const userId = localStorage.getItem("userId");

        if (!token || !userId) {
          throw new Error("Authentication token or user ID not found. Please log in.");
        }

        // Step 1: Send a POST request to get the cart data
        const response = await fetch("http://localhost:5000/cart/get-cart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
          body: JSON.stringify({ userId }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch cart data.");
        }

        const data = await response.json();
        console.log("the cart data is ", data);

        if (data.success) {
          // Get product details (assuming you have a way to get full product details for each cart item)
          const productsInCart = data.cart.productsInCart;
          
          // You would probably fetch product details from the backend here to enrich the cart items
          setCartItems(productsInCart); // Here, we just set the product IDs for now
        } else {
          throw new Error("Failed to load cart data.");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const handleRemoveItem = (itemId) => {
    const updatedCart = cartItems.filter(item => item._id !== itemId);
    setCartItems(updatedCart); // Update the state to reflect the changes
  };

  const handleCheckout = () => {
    if (cartItems.length > 0) {
      // Navigate to the checkout page
      router.push("/checkout");
    } else {
      setError("Your cart is empty. Please add some items before checking out.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-600 to-indigo-900">
        <p className="text-white text-xl">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-600 to-indigo-900">
        <p className="text-red-500 text-xl">{error}</p>
      </div>
    );
  }

  return (
    <div className="font-sans bg-gray-50 min-h-screen">
      {/* Navigation Bar */}
      <nav className="flex justify-between items-center p-5 bg-white shadow-lg">
        <div className="flex items-center">
          <Image
            src="/logo.png"
            alt="Mytalorzone By Sahiba Logo"
            width={50}
            height={50}
            className="rounded-full"
          />
        </div>
        <div className="space-x-6 text-lg font-semibold text-gray-800">
          <Link href="/profile" className="hover:text-indigo-600">
            Profile
          </Link>
          <Link href="/shop" className="hover:text-indigo-600">
            Shop
          </Link>
          <Link href="/about" className="hover:text-indigo-600">
            About
          </Link>
          <Link href="/contact" className="hover:text-indigo-600">
            Contact
          </Link>
        </div>
      </nav>

      {/* Cart Section */}
      <section className="p-6 sm:p-12 lg:p-16">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-semibold text-gray-800 mb-6 text-center">
            My Cart
          </h1>

          {cartItems.length === 0 ? (
            <div className="text-center text-gray-500">
              <p className="text-xl">Your cart is empty.</p>
              <button
                onClick={() => router.push("/shop")}
                className="mt-4 bg-indigo-500 text-white px-8 py-3 rounded-lg hover:bg-indigo-600"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between bg-white p-4 shadow-lg rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <Image
                      src={item.img || "/default-product-image.jpg"} // Assuming you can get product image URL
                      alt={item.name || "Product"}
                      width={100}
                      height={100}
                      className="rounded-lg"
                    />
                    <div className="space-y-2">
                      <p className="font-semibold text-gray-700">{item.name || "Product Name"}</p>
                      <p className="text-gray-500">₹{item.price || "0.00"}</p>
                      <p className="text-gray-500">Quantity: {item.quantity || 1}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemoveItem(item._id)}
                    className="text-red-500 hover:text-red-600 font-semibold"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Checkout Button */}
          <div className="mt-6 text-center">
            <button
              onClick={handleCheckout}
              className="bg-indigo-500 text-white px-8 py-3 rounded-lg hover:bg-indigo-600"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all products and categories
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
        const response = await fetch(`${backendUrl}/get-product`);

        if (!response.ok) {
          throw new Error("Failed to fetch product");
        }

        const data = await response.json();
        setProducts(data.products);
        setCategories(data.categories); // Assuming categories are returned in the response
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  return (
    <div className="font-sans bg-white overflow-hidden">
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
          <Link href="/dashboard" className="hover:text-indigo-600">
            Dashboard
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
        <div className="space-x-4">
          <button
            onClick={() => {
              localStorage.removeItem("authToken");
              router.push("/login");
            }}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Category Filter */}
      <section className="p-6 sm:p-12 lg:p-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-start space-x-6 mb-8">
            <button
              className={`py-2 px-4 rounded-lg ${selectedCategory === "All" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-800"}`}
              onClick={() => setSelectedCategory("All")}
            >
              All
            </button>
            {categories && categories.map((category) => (
              <button
                key={category}
                className={`py-2 px-4 rounded-lg ${selectedCategory === category ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-800"}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Product Listing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white shadow-lg rounded-lg overflow-hidden">
                <Image
                  src={product.img || '/placeholder.png'} 
                  alt={product.name}
                  width={500}
                  height={500}
                  className="object-cover w-full h-64"
                />
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-gray-800">{product.name}</h2>
                  <p className="mt-2 text-lg text-gray-600">{product.description}</p>
                  <p className="mt-4 text-xl font-semibold text-gray-800">${product.price}</p>
                  <p className="mt-2 text-sm text-gray-500">{product.category}</p>
                  <div className="mt-4">
                    <Link href={`/shop/${product._id}`} className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">
                      View Product
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

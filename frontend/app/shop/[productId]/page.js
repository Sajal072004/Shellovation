"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, notFound } from "next/navigation"; // For navigation

export default function ProductPage({ params }) {
  const { productId } = params; // Access productId from params
  const router = useRouter(); // For redirecting

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("filter-none"); // Current filter

  // Available filters
  const filters = [
    { name: "None", className: "filter-none" },
    { name: "Grayscale", className: "filter grayscale" },
    { name: "Sepia", className: "filter sepia" },
    { name: "Blur", className: "filter blur-sm" },
    { name: "Brightness", className: "filter brightness-125" },
    { name: "Contrast", className: "filter contrast-150" },
  ];

  // Fetch product details on load
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
        const response = await fetch(`${backendUrl}/product/${productId}`);

        if (!response.ok) {
          throw new Error("Product not found");
        }

        const data = await response.json();
        setProduct(data.product);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProductDetails();
    }
  }, [productId]);

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

  if (!product) {
    return notFound(); // Show 404 page if product is not found
  }

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
        <div className="space-x-4 flex items-center">
          <Link href="/profile">
            <Image
              src="/profile.png"
              alt="User Profile"
              width={40}
              height={40}
              className="rounded-full"
            />
          </Link>
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

      {/* Product Details Section */}
      <section className="p-6 sm:p-12 lg:p-16 relative">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center space-y-6 lg:space-y-0 lg:space-x-12">
          {/* Main Product Image */}
          <div className="w-full lg:h-[70vh] h-[50vh] flex justify-center items-center">
            <Image
              src={
                product.img && !product.img.startsWith("https://example.com")
                  ? product.img
                  : "/placeholder.png"
              }
              alt={product.name}
              width={400}
              height={600}
              className={`rounded-lg shadow-lg ${activeFilter}`}
            />
          </div>

          {/* Product Info */}
          <div className="w-full lg:w-1/2 lg:pl-10">
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">
              {product.name}
            </h1>
            <p className="mt-4 text-lg sm:text-xl text-gray-600">
              {product.description}
            </p>

            {/* Product Filters */}
            <div className="mt-6 flex space-x-4">
              {filters.map((filter) => (
                <button
                  key={filter.name}
                  onClick={() => setActiveFilter(filter.className)}
                  className={`p-2 rounded-lg ${
                    activeFilter === filter.className
                      ? "bg-indigo-500 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {filter.name}
                </button>
              ))}
            </div>

            <p className="mt-6 text-2xl font-semibold text-gray-800">
              ${product.price}
            </p>

            <div className="mt-6">
              <button className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 focus:outline-none">
                Add to Cart
              </button>
            </div>
          </div>
        </div>

        {/* Thumbnails for filters */}
        <div className="flex space-x-4 mt-[-30px] justify-center">
          {filters.map((filter) => (
            <Image
              key={filter.name}
              src={
                product.img && !product.img.startsWith("https://example.com")
                  ? product.img
                  : "/placeholder.png"
              }
              alt={filter.name}
              width={80}
              height={80}
              className={`cursor-pointer rounded-md border border-gray-300 ${filter.className}`}
              onClick={() => setActiveFilter(filter.className)}
            />
          ))}
        </div>
      </section>

      {/* Back to Shop Button */}
      <div className="p-4 text-center">
        <Link href="/shop" className="text-indigo-600 hover:text-indigo-800">
          ← Back to Shop
        </Link>
      </div>
    </div>
  );
}

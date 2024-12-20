"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { notFound } from "next/navigation"; // If you want to show a 404 page if product is not found
import Link from "next/link";
import { useRouter } from "next/navigation"; // For navigation

export default function ProductPage({ params }) {
  const { productId } = params; // Access productId from params
  const router = useRouter(); // For redirecting

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
              src="/profile.png" // You can replace this with an actual profile image or icon
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
      <section className="p-6 sm:p-12 lg:p-16">
        <div className="max-w-7xl mx-auto flex flex-col-reverse lg:flex-row items-center space-y-6 lg:space-y-0 lg:space-x-12">
          {/* Product Image */}
          <div className="w-full lg:h-[70vh] h-[50vh] mb-8 lg:mb-0">
            <Image
              src={
                product.img && !product.img.startsWith("https://example.com")
                  ? product.img
                  : "/placeholder.png"
              }
              alt={product.name}
              width={400} // Adjust width here
              height={400} // Adjust height here
              className="object-cover w-full h-full rounded-lg shadow-lg"
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

            {/* Product Category and Rating */}
            <div className="mt-6 flex items-center space-x-4">
              <span className="text-sm text-gray-500">{product.category}</span>
              <div className="flex items-center">
                {/* Render stars horizontally based on the rating */}
                <div className="flex space-x-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <svg
                      key={i}
                      className={`h-5 w-5 ${i < product.rating ? "text-yellow-400" : "text-gray-300"}`}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 15.27l4.14 2.18-1.11-4.86L18 8.47l-4.91-.42L10 3 7.91 8.05 3 8.47l3.86 3.12-1.11 4.86L10 15.27z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-500">({product.rating})</span>
              </div>
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

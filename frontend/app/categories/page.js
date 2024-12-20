"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation"; // For navigation

export default function CategoriesPage() {
  const router = useRouter(); // For redirecting
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categoryList = [
    "Men's Clothing",
    "Women's Clothing",
    "Accessories",
    "Footwear",
    "Sportswear",
    "Kids Clothing",
    "Home & Kitchen",
    "Electronics",
    "Books",
    "Beauty & Personal Care"
  ];

  const categoryImageMap = {
    "Men's Clothing": "/mens_clothing.png",
    "Women's Clothing": "/womens_clothing.png",
    "Accessories": "/accessory.png",
    "Footwear": "/footwear.png",
    "Sportswear": "/sportsware.png",
    "Kids Clothing": "/kids_clothing.png",
    "Home & Kitchen": "/home_kitchen.png",
    "Electronics": "/electronics.png",
    "Books": "/books.png",
    "Beauty & Personal Care": "/beauty_personal_care.png"
  };
  
  const getProductImage = (category) => {

    return categoryImageMap[category] || "/placeholder.png";
  };
  
 
  

  // Fetch products by category
  const fetchProductsByCategory = async (category) => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      const response = await fetch(`${backendUrl}/product/category`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ category }),
      });
      const data = await response.json();
      return data.success ? data.products : [];
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to load products.");
      return [];
    }
  };

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const allCategoriesData = [];
        for (const element of categoryList) {
          const category = element;
          const products = await fetchProductsByCategory(category);
          allCategoriesData.push({ category, products });
        }
        setCategories(allCategoriesData);
        console.log(allCategoriesData);
      } catch (error) {
        setError("Error loading categories.");
      }
      setLoading(false);
    };

    loadProducts();
  }, []);

  if (loading) {
    return <p>Loading categories...</p>;
  }

  if (error) {
    return <p>{error}</p>;
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

      {/* Categories Section */}
      <section className="p-6 sm:p-12 lg:p-16 bg-gray-50">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl font-semibold text-gray-800">Shop by Categories</h1>
          <p className="mt-4 text-lg text-gray-600">
            Browse through various categories to find your perfect style.
          </p>

          <div className="mt-10">
            {/* Loop through all categories */}
            {categories.map((categoryData) => (
              <div key={categoryData.category} className="mb-16">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">{categoryData.category}</h2>
                
                {/* Products for the current category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {categoryData.products.length > 0 ? (
                    categoryData.products.map((product) => (
                      <div
                        key={product._id}
                        className="bg-white rounded-lg shadow-lg overflow-hidden"
                      >
                        <Image
                          src={product.img && !(product.img.startsWith("https://example.com") || product.img.startsWith('https://www.google.com/imgres')) ? product.img : getProductImage(product.category)} 
                          alt={product.name}
                          width={500}
                          height={300}
                          className="w-full h-64 object-cover"
                        />
                        <div className="p-6 text-center">
                          <h3 className="text-lg font-semibold text-indigo-600 hover:text-indigo-700">{product.name}</h3>
                          <p className="text-gray-600">Price: ${product.price}</p>
                          <p className="text-gray-600">Rating: {product.rating} ★</p>
                          <Link href={`/shop/${product._id}`} className="text-indigo-600 hover:text-indigo-700 mt-2 inline-block">
                            View Details
                          </Link>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No products available in this category.</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

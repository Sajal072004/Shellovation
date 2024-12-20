"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [products, setProducts] = useState([]); // State for storing products

  useEffect(() => {
    const checkAuth = async () => {
      const authToken = localStorage.getItem("authToken");
      console.log(authToken);
      if (!authToken) {
        router.push("/login");
        return;
      }

      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
        const response = await fetch(`${backendUrl}/auth/verify-token`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${authToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          router.push("/login");
        }
      } catch (error) {
        console.error("Authentication failed:", error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
        const response = await fetch(`${backendUrl}/get-product`);
        const data = await response.json();

        // Log the fetched product data
        console.log("Fetched product data:", data);
  
        // Select the first 4 products and update the state
        setProducts(data.products.slice(0, 4));
        console.log("First 4 products:", data.products.slice(0, 4));
      } catch (error) {
        console.error("Error fetching products:", error);
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

  if (!user) {
    return null; // Redirect to login if no user is found
  }

  console.log("Current products:", products); // Log current products state

  return (
    <div className="font-sans bg-white">
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

      {/* Hero Section */}
      <section className="relative w-full h-[80vh] lg:h-[85vh]">
        <Image
          src="/fashion1.png"
          alt="Fashionable Clothing"
          fill
          style={{ objectFit: "cover" }}
          quality={100}
        />
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white px-5">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">Welcome Back, {user.name}!</h1>
          <p className="text-xl lg:text-2xl mb-6">
            Explore the latest fashion trends and shop your favorites.
          </p>
          <Link
            href="/shop"
            className="bg-red-500 text-white px-6 py-3 rounded-lg text-xl hover:bg-red-600"
          >
            Start Shopping
          </Link>
        </div>
      </section>

      {/* Featured Categories Section */}
      <section className="p-16 bg-gray-50">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Shop by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Category 1 */}
          <div className="relative w-full h-64 bg-gray-200 rounded-lg shadow-lg">
            <Image
              src="/mens_clothing.png"
              alt="Men's Clothing"
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
            <div className="absolute inset-0 bg-black opacity-30"></div>
            <div className="absolute bottom-0 left-0 p-6 text-white">
              <h3 className="text-2xl font-semibold">Men's Clothing</h3>
              <Link
                href="/shop/men"
                className="bg-red-500 text-white px-4 py-2 rounded-lg mt-4 inline-block hover:bg-red-600"
              >
                Shop Now
              </Link>
            </div>
          </div>

          {/* Category 2 */}
          <div className="relative w-full h-64 bg-gray-200 rounded-lg shadow-lg">
            <Image
              src="/womens_clothing.png"
              alt="Women's Clothing"
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
            <div className="absolute inset-0 bg-black opacity-30"></div>
            <div className="absolute bottom-0 left-0 p-6 text-white">
              <h3 className="text-2xl font-semibold">Women's Clothing</h3>
              <Link
                href="/shop/women"
                className="bg-red-500 text-white px-4 py-2 rounded-lg mt-4 inline-block hover:bg-red-600"
              >
                Shop Now
              </Link>
            </div>
          </div>

          {/* Category 3 */}
          <div className="relative w-full h-64 bg-gray-200 rounded-lg shadow-lg">
            <Image
              src="/accessory.png"
              alt="Accessories"
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
            <div className="absolute inset-0 bg-black opacity-30"></div>
            <div className="absolute bottom-0 left-0 p-6 text-white">
              <h3 className="text-2xl font-semibold">Accessories</h3>
              <Link
                href="/shop/accessories"
                className="bg-red-500 text-white px-4 py-2 rounded-lg mt-4 inline-block hover:bg-red-600"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="p-16 bg-white">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Trending Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <Image
                src={product.img || "/default-product.jpg"}
                alt={product.name || "Product"}
                width={500}
                height={500}
                className="object-cover w-full h-60"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800">{product.name}</h3>
                <p className="mt-2 text-gray-600">${product.price}</p>
                <Link
                  href={`/shop/${product.id}`}
                  className="bg-red-500 text-white px-6 py-2 rounded-lg mt-4 inline-block hover:bg-red-600"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation"; // For navigation

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null); // User information
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user details on load
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
        const token = localStorage.getItem("authToken");

        const response = await fetch(`${backendUrl}/get-user`, {
          headers: {
            Authorization: `${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        if (data.users && data.users.length > 0) {
          setUser(data.users[0]); // Extract the first user object
        } else {
          throw new Error("User not found");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
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

  return (
    <div className="font-sans bg-white min-h-screen">
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

      {/* Profile Section */}
      <section className="p-6 sm:p-12 lg:p-16">
        <div className="max-w-4xl mx-auto bg-gray-50 shadow-lg rounded-lg p-8">
          {/* Profile Header */}
          <div className="flex items-center space-x-6 mb-6">
            <Image
              src="/profile.png"
              alt="User Avatar"
              width={80}
              height={80}
              className="rounded-full border border-gray-300"
            />
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">
                {user.name}
              </h1>
              <p className="text-gray-600">{user.email}</p>
              <p className="text-gray-500 text-sm">
                Account Status:{" "}
                <span
                  className={`${
                    user.accountStatus === "open"
                      ? "text-green-500"
                      : "text-red-500"
                  } font-medium`}
                >
                  {user.accountStatus}
                </span>
              </p>
            </div>
          </div>

          {/* Profile Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div>
              <h2 className="text-gray-800 font-semibold">User ID</h2>
              <p className="text-gray-600">{user.userId}</p>
            </div>
            <div>
              <h2 className="text-gray-800 font-semibold">Phone</h2>
              <p className="text-gray-600">{user.phone}</p>
            </div>
          </div>

          {/* My Orders and Become a Seller */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                My Orders
              </h2>
              <p className="text-gray-600">
                View your order history, track deliveries, and manage returns.
              </p>
              <button
                onClick={() => router.push("/profile/orders")}
                className="mt-4 bg-indigo-500 text-white px-6 py-2 rounded-lg hover:bg-indigo-600"
              >
                View Orders
              </button>
            </div>
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Become a Seller
              </h2>
              <p className="text-gray-600">
                Join as a seller to manage your products and track sales.
              </p>
              <button
                onClick={() => router.push("/seller")}
                className="mt-4 bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
              >
                Become a Seller
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

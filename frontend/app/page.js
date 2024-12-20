import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheckIcon,
  HeartIcon,
  GlobeAltIcon,
  LightningBoltIcon,
  AcademicCapIcon,
  ShoppingBagIcon,
  MailIcon,
} from "@heroicons/react/solid";

export default function Home() {
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
          <Link href="/" className="hover:text-indigo-600">
            Home
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
          <Link
            href="/login"
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600"
          >
            Sign Up
          </Link>
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
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            Welcome to Mytalorzone By Sahiba
          </h1>
          <p className="text-xl lg:text-2xl mb-6">
            Your destination for the latest fashion trends.
          </p>
          <Link
            href="/shop"
            className="bg-red-500 text-white px-6 py-3 rounded-lg text-xl hover:bg-red-600"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="flex flex-col lg:flex-row justify-around items-center p-16 bg-gray-50">
        {/* Feature 1 */}
        <div className="flex flex-col items-center text-center w-full lg:w-1/3 mb-8 lg:mb-0">
          <div className="relative w-72 h-72">
            <Image
              src="/exclusive.png"
              alt="Exclusive Collections"
              layout="fill"
              objectFit="cover"
              className="rounded-lg shadow-lg"
            />
          </div>
          <HeartIcon className="w-12 h-12 text-red-500 mt-4" />
          <h3 className="text-2xl font-semibold mt-4 text-gray-800">
            Exclusive Collections
          </h3>
          <p className="mt-2 text-gray-700">
            Explore our curated selection of premium apparel.
          </p>
        </div>

        {/* Feature 2 */}
        <div className="flex flex-col items-center text-center w-full lg:w-1/3 mb-8 lg:mb-0">
          <div className="relative w-72 h-72">
            <Image
              src="/quality.png"
              alt="Quality Materials"
              layout="fill"
              objectFit="cover"
              className="rounded-lg shadow-lg"
            />
          </div>
          <ShieldCheckIcon className="w-12 h-12 text-green-500 mt-4" />
          <h3 className="text-2xl font-semibold mt-4 text-gray-800">
            Quality Materials
          </h3>
          <p className="mt-2 text-gray-700">
            Crafted with the finest fabrics for ultimate comfort.
          </p>
        </div>

        {/* Feature 3 */}
        <div className="flex flex-col items-center text-center w-full lg:w-1/3">
          <div className="relative w-72 h-72">
            <Image
              src="/customer.png"
              alt="Customer Satisfaction"
              layout="fill"
              objectFit="cover"
              className="rounded-lg shadow-lg"
            />
          </div>
          <GlobeAltIcon className="w-12 h-12 text-indigo-500 mt-4" />
          <h3 className="text-2xl font-semibold mt-4 text-gray-800">
            Customer Satisfaction
          </h3>
          <p className="mt-2 text-gray-700">
            Dedicated to providing exceptional service and support.
          </p>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-white py-16 px-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Why Choose Us?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <LightningBoltIcon className="w-16 h-16 text-yellow-500 mx-auto" />
            <h3 className="text-xl font-semibold mt-4 text-gray-800">
              Innovative Styles
            </h3>
            <p className="text-gray-600">
              Discover fashion that keeps you ahead of the curve.
            </p>
          </div>
          <div>
            <ShoppingBagIcon className="w-16 h-16 text-red-500 mx-auto" />
            <h3 className="text-xl font-semibold mt-4 text-gray-800">
              Affordable Luxury
            </h3>
            <p className="text-gray-600">
              Luxury you can afford, crafted for everyone.
            </p>
          </div>
          <div>
            <AcademicCapIcon className="w-16 h-16 text-indigo-500 mx-auto" />
            <h3 className="text-xl font-semibold mt-4 text-gray-800">
              Expertly Curated
            </h3>
            <p className="text-gray-600">
              Every piece handpicked to suit your taste.
            </p>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="bg-indigo-500 py-16 text-white text-center">
        <MailIcon className="w-12 h-12 mx-auto text-white mb-4" />
        <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
        <p className="mb-8">
          Subscribe to our newsletter for the latest trends and exclusive offers.
        </p>
        <form className="flex justify-center">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-1/3 px-4 py-2 rounded-l-lg text-gray-700"
          />
          <button
            type="submit"
            className="bg-red-500 px-6 py-2 rounded-r-lg hover:bg-red-600"
          >
            Subscribe
          </button>
        </form>
      </section>
    </div>
  );
}

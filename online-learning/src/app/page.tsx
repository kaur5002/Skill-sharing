// app/page.tsx
"use client";
import React, { useState, useCallback } from "react";
import { FaStar, FaRegStar } from "react-icons/fa";

type RatingProps = {
  value: number;
};
    
const Rating: React.FC<RatingProps> = ({ value }) => (
  <div className="flex">
    {[...Array(5)].map((_, i) =>
      i < value ? (
        <FaStar key={i} className="text-yellow-400" />
      ) : (
        <FaRegStar key={i} className="text-gray-300" />
      )
    )}
  </div>
);

const LandingPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  const toggleModal = useCallback(() => setIsModalOpen(!isModalOpen), [isModalOpen]);
  const switchAuthMode = useCallback(() => setIsLogin(!isLogin), [isLogin]);

  return (
    <div className="font-sans text-gray-900">
      {/* Header */}
      <header className="flex justify-between items-center p-6 bg-white shadow-md">
        <h1 className="text-2xl font-bold">Scale</h1>
        <div>
          <button
            className="px-4 py-2 mr-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            onClick={() => {
              setIsLogin(true);
              toggleModal();
            }}
          >
            Login
          </button>
          <button
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            onClick={() => {
              setIsLogin(false);
              toggleModal();
            }}
          >
            Sign Up
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-20 bg-gray-50">
        <h2 className="text-4xl font-bold mb-4">Learn Anything, Anytime</h2>
        <p className="mb-6 text-gray-700 max-w-xl">
          Join thousands of learners and experts to share and gain skills online.
        </p>
        <button
          className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          onClick={() => {
            setIsLogin(false);
            toggleModal();
          }}
        >
          Get Started
        </button>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 text-center">
          {[
            { title: "Expert Instructors", desc: "Learn from industry leaders." },
            { title: "Flexible Learning", desc: "Study anytime, anywhere." },
            { title: "Certification", desc: "Earn recognized credentials." },
          ].map((feature) => (
            <div key={feature.title} className="p-6 border rounded hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-gray-50">
        <h3 className="text-2xl font-bold text-center mb-8">Popular Categories</h3>
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 md:grid-cols-4 gap-6">
          {["Web Development", "Design", "Business", "Marketing"].map((cat) => (
            <div
              key={cat}
              className="p-6 bg-white rounded shadow hover:scale-105 transition transform cursor-pointer"
            >
              <h4 className="font-semibold text-lg">{cat}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <h3 className="text-2xl font-bold text-center mb-12">Testimonials</h3>
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            { name: "Alice", rating: 5, text: "Amazing platform!" },
            { name: "Bob", rating: 4, text: "Learned so much." },
            { name: "Charlie", rating: 5, text: "Highly recommend it." },
          ].map((t) => (
            <div key={t.name} className="p-6 border rounded">
              <Rating value={t.rating} />
              <p className="mt-4 text-gray-700">"{t.text}"</p>
              <p className="mt-2 font-semibold">{t.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 text-center">
        &copy; {new Date().getFullYear()} SkillShare. All rights reserved.
      </footer>

      {/* Auth Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={toggleModal}
        >
          <div
            className="bg-white rounded-lg p-8 w-full max-w-md relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={toggleModal}
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-6 text-center">
              {isLogin ? "Login" : "Sign Up"}
            </h2>
            <form className="flex flex-col gap-4">
              {!isLogin && <input type="text" placeholder="Full Name" className="border p-2 rounded" />}
              <input type="email" placeholder="Email" className="border p-2 rounded" />
              <input type="password" placeholder="Password" className="border p-2 rounded" />
              <button
                type="submit"
                className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
              >
                {isLogin ? "Login" : "Sign Up"}
              </button>
            </form>
            <p className="mt-4 text-center text-gray-600">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button className="text-blue-600 underline" onClick={switchAuthMode}>
                {isLogin ? "Sign Up" : "Login"}
              </button>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;

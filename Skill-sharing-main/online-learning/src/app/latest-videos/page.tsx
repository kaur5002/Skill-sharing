"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Play, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";

const videos = [
  {
    id: 1,
    title: "Content Marketing Strategy",
    tutor: "Charlie Brown",
    duration: "1:50:30",
    thumbnail: "/videos/marketing.jpg",
  },
  {
    id: 2,
    title: "SEO Fundamentals",
    tutor: "Charlie Brown",
    duration: "2:00:00",
    thumbnail: "/videos/seo.jpg",
  },
  {
    id: 3,
    title: "UI Design Principles",
    tutor: "Bob Williams",
    duration: "1:30:10",
    thumbnail: "/videos/ui-design.jpg",
  },
  {
    id: 4,
    title: "Photoshop for Beginners",
    tutor: "Bob Williams",
    duration: "2:15:00",
    thumbnail: "/videos/photoshop.jpg",
  },
  {
    id: 5,
    title: "Introduction to Figma",
    tutor: "Laura Harris",
    duration: "1:45:20",
    thumbnail: "/videos/figma.jpg",
  },
  {
    id: 6,
    title: "Node.js and Express Basics",
    tutor: "Alice Johnson",
    duration: "2:45:50",
    thumbnail: "/videos/nodejs.jpg",
  },
  {
    id: 7,
    title: "React Crash Course 2024",
    tutor: "Alice Johnson",
    duration: "3:05:00",
    thumbnail: "/videos/react.jpg",
  },
  {
    id: 8,
    title: "JavaScript Fundamentals",
    tutor: "Alice Johnson",
    duration: "2:30:15",
    thumbnail: "/videos/javascript.jpg",
  },
  {
    id: 9,
    title: "Data Science for Beginners",
    tutor: "Diana Prince",
    duration: "2:10:45",
    thumbnail: "/videos/data-science.jpg",
  },
  {
    id: 10,
    title: "Modern CSS Mastery",
    tutor: "Alex Johnson",
    duration: "1:40:30",
    thumbnail: "/videos/css.jpg",
  },
  {
    id: 11,
    title: "Introduction to Psychology",
    tutor: "Dr. Olivia Zhang",
    duration: "1:55:25",
    thumbnail: "/videos/psychology.jpg",
  },
  {
    id: 12,
    title: "Cloud Computing Fundamentals",
    tutor: "Victor Chen",
    duration: "2:20:50",
    thumbnail: "/videos/cloud.jpg",
  },
];

export default function LatestVideosPage() {
  const [search, setSearch] = useState("");

  const filteredVideos = useMemo(() => {
    return videos.filter(
      (v) =>
        v.title.toLowerCase().includes(search.toLowerCase()) ||
        v.tutor.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="text-center py-12">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">
          Latest Video Uploads
        </h1>
        <p className="text-gray-600 text-lg">
          Check out the newest content from our expert tutors.
        </p>
      </section>

      {/* Search bar */}
      <div className="max-w-4xl mx-auto px-4 mb-8 flex items-center gap-3">
        <Input
          placeholder="Search videos or tutors..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full"
        />
      </div>

      {/* Video Grid */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredVideos.length > 0 ? (
            filteredVideos.map((video) => (
              <div
                key={video.id}
                className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow overflow-hidden"
              >
                <div className="relative w-full h-48">
                  <Image
                    src={video.thumbnail}
                    alt={video.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <Play className="w-12 h-12 text-white opacity-90" />
                  </div>
                  <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {video.duration}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 text-lg mb-1">
                    {video.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">
                    by {video.tutor}
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Watch Now
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full">
              No videos found.
            </p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

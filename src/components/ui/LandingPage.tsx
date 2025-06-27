"use client";

import type { Metadata } from "next";
import "@/app/globals.css";
import RecoilRootComponent from "@/components/context/recoilroot";
import { Toaster } from "sonner";
import { QueryClientProviderComponent } from "@/components/context/queryClientComponent";
import { BackgroundMusic } from "@/components/shared/BackgroundMusic";
import { LanguageSelector } from "../game/shared/languageSelector";
import { useListModules } from "@/data/module";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import Link from "next/link";


export default function LandingPage() {

    const { data: modules, isLoading, error } = useListModules();
    const quizContainerRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right") => {
    if (quizContainerRef.current) {
        quizContainerRef.current.scrollBy({
        left: direction === "left" ? -300 : 300,
        behavior: "smooth",
        });
    }
    };

    return (
      <div className="min-h-screen w-screen bg-purple-light text-white font-sans overflow-x-hidden">
        <Toaster position="top-center" richColors />
        <QueryClientProviderComponent>
          <RecoilRootComponent>
            {/* HEADER */}
            <header className="w-full flex justify-between items-center p-6">
              <h1 className="text-2xl font-bold">QuizVerse</h1>
              <nav className="space-x-4">
                <Link href="/quiz" className="hover:underline">
                  Quizzes
                </Link>
                <a href="#games" className="hover:underline">
                  Games
                </a>
                <a href="#contact" className="hover:underline">
                  Contact
                </a>
              </nav>
              <LanguageSelector />
            </header>
  
            {/* HERO SECTION */}
            <main className="flex flex-col items-center justify-center py-20 px-4 text-center">
              <h2 className="text-4xl md:text-6xl font-bold mb-4">
                Challenge Your Mind
              </h2>
              <p className="text-lg md:text-xl max-w-xl mb-6">
                Explore our collection of quizzes and games to learn while having fun!
              </p>
              <a href="#quizzes">
                <button className="bg-white text-purple-light font-bold py-2 px-6 rounded-lg hover:bg-gray-200 transition">
                  Get Started
                </button>
              </a>
            </main>
  
            {/* QUIZZES SECTION */}
            <section id="quizzes" className="px-6 py-12 bg-white text-purple-light w-full relative">
                <h3 className="text-3xl font-bold mb-6">Featured Quizzes</h3>

                {isLoading && <p>Loading quizzes...</p>}
                {error && <p>Failed to load quizzes</p>}

                {/* Scroll Arrows */}
                <button
                    onClick={() => scroll("left")}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-purple-light text-white p-2 rounded-full shadow hover:bg-purple-dark"
                >
                    <ChevronLeft />
                </button>
                <button
                    onClick={() => scroll("right")}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-purple-light text-white p-2 rounded-full shadow hover:bg-purple-dark"
                >
                    <ChevronRight />
                </button>

                {/* Carousel Container */}
                <div
                    ref={quizContainerRef}
                    className="flex gap-6 overflow-x-auto scroll-smooth scrollbar-hide py-4 px-2"
                >
                    {modules?.map((quiz) => (
                    <div
                        key={quiz.id}
                        className="min-w-[300px] max-w-[300px] bg-white border p-4 rounded-xl shadow-sm flex-shrink-0"
                    >
                        <h4 className="text-lg font-bold text-purple-dark mb-2">
                        {quiz.name}
                        </h4>
                        <p className="text-sm text-gray-600 line-clamp-5 mb-4">
                        {quiz.description || "No description available."}
                        </p>
                        <a
                        href={`/quiz/${quiz.id}`}
                        className="inline-block bg-purple-light text-white px-4 py-2 rounded hover:bg-purple-dark transition"
                        >
                        Play Quiz
                        </a>
                    </div>
                    ))}
                </div>
                </section>
                
            {/* CONTACT SECTION */}
            <section
              id="contact"
              className="px-6 py-12 bg-white text-purple-light w-full"
            >
              <h3 className="text-3xl font-bold mb-4">Contact Us</h3>
              <p className="mb-4">
                Have feedback or ideas? We'd love to hear from you.
              </p>
              <a
                href="mailto:team@quizverse.com"
                className="text-blue-600 hover:underline"
              >
                team@quizverse.com
              </a>
            </section>
  
            {/* FOOTER */}
            <footer className="text-center py-6 text-sm opacity-70">
              © {new Date().getFullYear()} QuizVerse — All rights reserved.
            </footer>
  
            <BackgroundMusic />
          </RecoilRootComponent>
        </QueryClientProviderComponent>
      </div>
    );
  }

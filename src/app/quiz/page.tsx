"use client";

import { useState } from "react";
import { useListModules } from "@/data/module";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function QuizzesPage() {
  const { data: modules, isLoading, error } = useListModules();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filteredModules = modules?.filter((quiz) => {
    const matchesSearch =
      quiz.name.toLowerCase().includes(search.toLowerCase()) ||
      quiz.description?.toLowerCase().includes(search.toLowerCase());

    const matchesFilter = filter === "all" || quiz.type === filter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen px-6 py-12 bg-gray-100 text-black">
      <h1 className="text-4xl font-bold mb-6">All Quizzes</h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-8">
        <Input
          type="text"
          placeholder="Search quizzes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2"
        />

        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="quiz">Quiz</SelectItem>
            <SelectItem value="game">Game</SelectItem>
            {/* Add more filter types if needed */}
          </SelectContent>
        </Select>
      </div>

      {/* Content */}
      {isLoading && <p>Loading quizzes...</p>}
      {error && <p className="text-red-600">Failed to load quizzes</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModules?.map((quiz) => (
          <div
            key={quiz.id}
            className="bg-white border rounded-lg shadow p-4"
          >
            <h2 className="text-xl font-bold text-purple-dark mb-2">{quiz.name}</h2>
            <p className="text-sm text-gray-600 line-clamp-4 mb-4">
              {quiz.description || "No description available."}
            </p>
            <a
              href={`/quiz/${quiz.id}`}
              className="bg-purple-light text-white px-4 py-2 rounded hover:bg-purple-dark transition"
            >
              Start Quiz
            </a>
          </div>
        ))}
      </div>

      {!isLoading && filteredModules?.length === 0 && (
        <p className="mt-10 text-gray-500 text-center">No quizzes found.</p>
      )}
    </div>
  );
}
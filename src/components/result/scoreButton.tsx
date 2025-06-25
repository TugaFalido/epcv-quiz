"use client";

// import { submitScore } from "@/server/actions";
import { useState, useEffect } from "react";

interface LTIData {
  sourcedId: string;
  outcomeUrl: string;
  userId: string;
  contextId: string;
}

export default function ScoreSubmitButton({
  score,
  totalPoints,
}: {
  score: number;
  totalPoints: number;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ltiData, setLtiData] = useState<LTIData | null>(null);

  // useEffect(() => {
  //   // Fetch LTI data from your debug endpoint
  //   async function fetchLtiData() {
  //     try {
  //       const response = await fetch("/api/lti/launch");
  //       if (!response.ok) {
  //         throw new Error("Failed to fetch LTI data");
  //       }
  //       const data = await response.json();
  //       setLtiData(data.ltiData);
  //     } catch (e) {
  //       setError("Failed to load LTI data");
  //       console.error("LTI data fetch error:", e);
  //     }
  //   }

  //   fetchLtiData();
  // }, []);

  async function handleSubmit() {
    if (!ltiData) {
      setError("No LTI data available. Please launch from Moodle.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // await submitScore(score, totalPoints);
      alert("Score submitted successfully!");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to submit score");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded p-4 text-red-700">
          {error}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={submitting || !ltiData}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400 hover:bg-blue-600 transition-colors"
      >
        {submitting ? "Submitting..." : "Submit Score to Moodle"}
      </button>

      {process.env.NODE_ENV === "development" && (
        <div className="text-sm text-gray-500">
          LTI Data Status: {ltiData ? "Available" : "Not Available"}
        </div>
      )}
    </div>
  );
}
